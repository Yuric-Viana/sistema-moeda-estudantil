#!/usr/bin/env bash

BASE_URL="${BASE_URL:-http://localhost:8080}"
API="$BASE_URL/api/empresas-parceiras"
DB_USER="${DB_USER:-root}"
DB_NAME="${DB_NAME:-moeda_estudantil}"
if [ -n "$DB_PASSWORD" ]; then
  export MYSQL_PWD="$DB_PASSWORD"
fi

CNPJ_A="90.100.200/0001-09"
CNPJ_A_SEM_MASCARA="90100200000109"
CNPJ_B="90.100.300/0001-35"
ID_INEXISTENTE="00000000-0000-0000-0000-000000000000"

PASSOU=0
FALHOU=0
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

verde() { printf '\033[32m%s\033[0m' "$1"; }
vermelho() { printf '\033[31m%s\033[0m' "$1"; }

ok() {
  PASSOU=$((PASSOU + 1))
  echo "  $(verde '✔') $1"
}

falha() {
  FALHOU=$((FALHOU + 1))
  echo "  $(vermelho '✘') $1"
  echo "      $2"
}

requisicao() {
  local metodo="$1" caminho="$2" corpo="$3"
  if [ -n "$corpo" ]; then
    STATUS="$(curl -s -o "$TMP" -w '%{http_code}' -X "$metodo" "$API$caminho" \
      -H 'Content-Type: application/json' -d "$corpo")"
  else
    STATUS="$(curl -s -o "$TMP" -w '%{http_code}' -X "$metodo" "$API$caminho")"
  fi
  RESPOSTA="$(cat "$TMP")"
}

confere_status() {
  if [ "$STATUS" = "$2" ]; then
    ok "$1 (HTTP $STATUS)"
  else
    falha "$1" "esperado HTTP $2, obtido HTTP $STATUS: $RESPOSTA"
  fi
}

confere_contem() {
  case "$RESPOSTA" in
    *"$2"*) ok "$1" ;;
    *) falha "$1" "a resposta não contém '$2': $RESPOSTA" ;;
  esac
}

confere_nao_contem() {
  case "$RESPOSTA" in
    *"$2"*) falha "$1" "a resposta contém '$2': $RESPOSTA" ;;
    *) ok "$1" ;;
  esac
}

confere_erro() {
  local achou=0
  case "$RESPOSTA" in
    *"$3"*) achou=1 ;;
  esac
  if [ "$STATUS" = "$2" ] && [ "$achou" = 1 ]; then
    ok "$1 (HTTP $STATUS)"
  else
    falha "$1" "esperado HTTP $2 com '$3', obtido HTTP $STATUS: $RESPOSTA"
  fi
}

consulta() {
  mysql -u "$DB_USER" -N -B "$DB_NAME" -e "$1" 2>/dev/null
}

confere_banco() {
  local obtido
  obtido="$(consulta "$2")"
  if [ "$obtido" = "$3" ]; then
    ok "$1"
  else
    falha "$1" "esperado '$3', obtido '$obtido'"
  fi
}

empresa() {
  printf '{"razaoSocial":"%s","email":"%s","cnpj":"%s","login":"%s","senha":"%s"}' "$1" "$2" "$3" "$4" "$5"
}

atualizacao() {
  printf '{"razaoSocial":"%s","email":"%s","cnpj":"%s"}' "$1" "$2" "$3"
}

extrair_id() {
  echo "$RESPOSTA" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p'
}

limpar_testes() {
  consulta "DELETE FROM empresa_parceira WHERE usuario_id IN (SELECT id FROM usuario WHERE login LIKE 'teste_auto%'); DELETE FROM usuario WHERE login LIKE 'teste_auto%';"
}

resumo() {
  limpar_testes
  echo
  echo "Resultado: $PASSOU passaram, $FALHOU falharam"
  [ "$FALHOU" -eq 0 ]
}

if ! command -v curl >/dev/null || ! command -v mysql >/dev/null; then
  echo "É preciso ter curl e mysql disponíveis no terminal."
  exit 1
fi

echo "Testes de integração: Empresa Parceira (API + MySQL)"
echo "Os registros criados aqui têm login 'teste_auto...' e são removidos ao final."

echo
echo "Preparação"
if [ "$(consulta 'SELECT 1')" != "1" ]; then
  echo "Não consegui conectar ao MySQL (usuário $DB_USER, banco $DB_NAME)."
  echo "Se o seu MySQL tem senha, rode com: DB_PASSWORD=sua_senha bash backend/scripts/testar-empresas.sh"
  exit 1
fi
limpar_testes
requisicao GET ""
confere_status "API responde na listagem" 200
if [ "$STATUS" != "200" ]; then
  echo "A API não respondeu em $API. Rode a aplicação no IntelliJ e tente de novo."
  exit 1
fi

echo
echo "Cadastro"
requisicao POST "" "$(empresa 'Restaurante Auto LTDA' 'Teste.Auto@Exemplo.com' "$CNPJ_A_SEM_MASCARA" 'teste_auto1' 'senha123')"
confere_status "cadastro válido" 201
ID_A="$(extrair_id)"
if [ -z "$ID_A" ]; then
  echo "O cadastro não devolveu um id; os próximos testes dependem dele."
  resumo
  exit 1
fi
confere_contem "CNPJ gravado com máscara, mesmo enviado só com números" "\"cnpj\":\"$CNPJ_A\""
confere_contem "email gravado em minúsculas" '"email":"teste.auto@exemplo.com"'
confere_nao_contem "resposta não expõe a senha" 'senha'
confere_banco "empresa e usuário gravados juntos (herança JOINED)" \
  "SELECT COUNT(*) FROM usuario u JOIN empresa_parceira e ON e.usuario_id = u.id WHERE u.id = '$ID_A'" "1"
confere_banco "senha guardada como hash BCrypt (60 caracteres)" \
  "SELECT CONCAT(LEFT(senha_hash, 7), ' ', LENGTH(senha_hash)) FROM usuario WHERE id = '$ID_A'" '$2a$10$ 60'

echo
echo "Consulta"
requisicao GET "/$ID_A"
confere_status "busca por id" 200
confere_contem "busca devolve a empresa cadastrada" 'Restaurante Auto LTDA'
requisicao GET ""
confere_contem "listagem contém a empresa" "$ID_A"
requisicao GET "/$ID_INEXISTENTE"
confere_erro "id inexistente" 404 'Empresa parceira não encontrada'
requisicao GET "/abc"
confere_erro "id em formato inválido" 400 'Identificador inválido'

echo
echo "Duplicidade (409)"
requisicao POST "" "$(empresa 'Outra LTDA' 'outro@exemplo.com' "$CNPJ_B" 'teste_auto1' 'senha123')"
confere_erro "login repetido" 409 'Login já cadastrado'
requisicao POST "" "$(empresa 'Outra LTDA' 'outro@exemplo.com' "$CNPJ_A" 'teste_auto2' 'senha123')"
confere_erro "CNPJ repetido (mesmo com máscara diferente)" 409 'CNPJ já cadastrado'
requisicao POST "" "$(empresa 'Outra LTDA' 'TESTE.AUTO@exemplo.com' "$CNPJ_B" 'teste_auto2' 'senha123')"
confere_erro "email repetido (ignorando maiúsculas)" 409 'Email já cadastrado'
confere_banco "os erros não deixaram registros no banco" \
  "SELECT COUNT(*) FROM usuario WHERE login LIKE 'teste_auto%'" "1"

echo
echo "Validações (400)"
requisicao POST "" "$(empresa '' 'a@exemplo.com' "$CNPJ_B" 'teste_auto3' 'senha123')"
confere_erro "razão social vazia" 400 'Razão social é obrigatória'
requisicao POST "" "$(empresa 'Outra LTDA' 'abc' "$CNPJ_B" 'teste_auto3' 'senha123')"
confere_erro "email inválido" 400 'Email inválido'
requisicao POST "" "$(empresa 'Outra LTDA' 'a@exemplo.com' '12.345.678/0001-90' 'teste_auto3' 'senha123')"
confere_erro "CNPJ com dígito verificador errado" 400 'CNPJ inválido'
requisicao POST "" "$(empresa 'Outra LTDA' 'a@exemplo.com' '11.111.111/1111-11' 'teste_auto3' 'senha123')"
confere_erro "CNPJ com todos os dígitos iguais" 400 'CNPJ inválido'
requisicao POST "" "$(empresa 'Outra LTDA' 'a@exemplo.com' "$CNPJ_B" 'ab' 'senha123')"
confere_erro "login curto demais" 400 'Login deve ter de 3 a 50'
requisicao POST "" "$(empresa 'Outra LTDA' 'a@exemplo.com' "$CNPJ_B" 'teste_auto3' '12345')"
confere_erro "senha com menos de 6 caracteres" 400 'Senha deve ter entre 6 e 72'
SENHA_LONGA="$(printf 'x%.0s' $(seq 1 73))"
requisicao POST "" "$(empresa 'Outra LTDA' 'a@exemplo.com' "$CNPJ_B" 'teste_auto3' "$SENHA_LONGA")"
confere_erro "senha com mais de 72 caracteres (limite do BCrypt)" 400 'Senha deve ter entre 6 e 72'
requisicao POST "" '{}'
confere_erro "corpo sem campos" 400 'Razão social é obrigatória'
requisicao POST "" '{"razaoSocial":'
confere_erro "JSON malformado" 400 'Corpo da requisição inválido'
confere_banco "nenhuma validação deixou registro no banco" \
  "SELECT COUNT(*) FROM usuario WHERE login LIKE 'teste_auto%'" "1"

echo
echo "Edição"
requisicao POST "" "$(empresa 'Segunda Auto LTDA' 'segunda.auto@exemplo.com' "$CNPJ_B" 'teste_auto2' 'senha123')"
confere_status "segunda empresa cadastrada" 201
ID_B="$(extrair_id)"
requisicao PUT "/$ID_A" "$(atualizacao 'Restaurante Auto Novo LTDA' 'Novo.Auto@exemplo.com' "$CNPJ_A_SEM_MASCARA")"
confere_status "edição válida" 200
confere_contem "edição devolve os dados novos" 'Restaurante Auto Novo LTDA'
confere_banco "edição persistida no MySQL" \
  "SELECT razao_social FROM empresa_parceira WHERE usuario_id = '$ID_A'" 'Restaurante Auto Novo LTDA'
confere_banco "login e senha preservados na edição" \
  "SELECT CONCAT(login, ' ', LEFT(senha_hash, 7)) FROM usuario WHERE id = '$ID_A'" 'teste_auto1 $2a$10$'
requisicao PUT "/$ID_A" "$(atualizacao 'Restaurante Auto Novo LTDA' 'novo.auto@exemplo.com' "$CNPJ_B")"
confere_erro "edição com CNPJ de outra empresa" 409 'CNPJ já cadastrado'
requisicao PUT "/$ID_A" "$(atualizacao 'Restaurante Auto Novo LTDA' 'segunda.auto@exemplo.com' "$CNPJ_A")"
confere_erro "edição com email de outra empresa" 409 'Email já cadastrado'
requisicao PUT "/$ID_A" "$(atualizacao 'Restaurante Auto Novo LTDA' 'novo.auto@exemplo.com' '12.345.678/0001-90')"
confere_erro "edição com CNPJ inválido" 400 'CNPJ inválido'
requisicao PUT "/$ID_INEXISTENTE" "$(atualizacao 'Qualquer LTDA' 'q@exemplo.com' "$CNPJ_A")"
confere_erro "edição de empresa inexistente" 404 'Empresa parceira não encontrada'

echo
echo "Exclusão"
requisicao DELETE "/$ID_A"
confere_status "exclusão" 204
requisicao GET "/$ID_A"
confere_erro "empresa excluída não é mais encontrada" 404 'Empresa parceira não encontrada'
confere_banco "linha removida de empresa_parceira" \
  "SELECT COUNT(*) FROM empresa_parceira WHERE usuario_id = '$ID_A'" "0"
confere_banco "linha removida também de usuario" \
  "SELECT COUNT(*) FROM usuario WHERE id = '$ID_A'" "0"
requisicao DELETE "/$ID_A"
confere_erro "excluir de novo" 404 'Empresa parceira não encontrada'
requisicao DELETE "/$ID_B"
confere_status "exclusão da segunda empresa" 204

resumo