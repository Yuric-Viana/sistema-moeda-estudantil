param([string]$Api = "http://localhost:8080/api")
$ErrorActionPreference = "Stop"
Write-Host "Verificando API em $Api" -ForegroundColor Cyan
try {
  $instituicoes = @(Invoke-RestMethod "$Api/instituicoes")
  if ($instituicoes.Count -eq 0) { throw "Não há instituições. Cadastre instituições e cursos antes do teste." }
  $inst = $instituicoes[0]
  $cursos = @(Invoke-RestMethod "$Api/instituicoes/$($inst.id)/cursos")
  if ($cursos.Count -eq 0) { throw "A instituição selecionada não possui cursos." }
  $curso = $cursos[0]
  $sufixo = Get-Random -Minimum 100000 -Maximum 999999
  $cpf = ('{0:D11}' -f [long]$sufixo)
  $dados = @{ nome="Aluno Teste $sufixo"; email="teste$sufixo@exemplo.com"; cpf=$cpf; rg="RG$sufixo"; endereco="Rua Teste, 10"; login="aluno_teste_$sufixo"; senha="SenhaTeste123"; instituicaoId=$inst.id; cursoId=$curso.id }
  $id = $null
  try {
    $novo = Invoke-RestMethod "$Api/alunos" -Method Post -ContentType 'application/json' -Body ($dados | ConvertTo-Json)
    $id = $novo.id
    if (-not $id) { throw 'POST sem id' }
    Write-Host "PASSOU: cadastrar ($id)" -ForegroundColor Green
    $lista = @(Invoke-RestMethod "$Api/alunos")
    if (-not ($lista | Where-Object { $_.id -eq $id })) { throw 'Aluno não encontrado na lista' }
    Write-Host "PASSOU: listar" -ForegroundColor Green
    $dados.nome = "Aluno Alterado $sufixo"
    $dados.senha = ''
    $editado = Invoke-RestMethod "$Api/alunos/$id" -Method Put -ContentType 'application/json' -Body ($dados | ConvertTo-Json)
    if ($editado.nome -ne $dados.nome) { throw 'PUT não alterou o nome' }
    Write-Host "PASSOU: editar" -ForegroundColor Green
  } finally {
    if ($id) {
      Invoke-RestMethod "$Api/alunos/$id" -Method Delete | Out-Null
      Write-Host "PASSOU: excluir" -ForegroundColor Green
    }
  }
  Write-Host 'CRUD de Alunos validado com dados temporários.' -ForegroundColor Green
} catch {
  Write-Error "TESTE FALHOU: $($_.Exception.Message)"
  exit 1
}
