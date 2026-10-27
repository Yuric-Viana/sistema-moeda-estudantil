package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.validator;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraAtualizacaoRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.exception.RequisicaoInvalidaException;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util.Cnpj;

import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

public final class EmpresaParceiraValidador {

    private static final Pattern EMAIL = Pattern.compile("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$");
    private static final Pattern LOGIN = Pattern.compile("^[A-Za-z0-9._-]{3,50}$");

    private EmpresaParceiraValidador() {
    }

    public static void validarCadastro(EmpresaParceiraRequest request) {
        validarDados(request.razaoSocial(), request.email(), request.cnpj());
        validarLogin(request.login());
        validarSenha(request.senha());
    }

    public static void validarAtualizacao(EmpresaParceiraAtualizacaoRequest request) {
        validarDados(request.razaoSocial(), request.email(), request.cnpj());
    }

    private static void validarDados(String razaoSocial, String email, String cnpj) {
        if (vazio(razaoSocial)) {
            throw new RequisicaoInvalidaException("Razão social é obrigatória");
        }
        if (razaoSocial.trim().length() > 150) {
            throw new RequisicaoInvalidaException("Razão social deve ter no máximo 150 caracteres");
        }
        if (vazio(email)) {
            throw new RequisicaoInvalidaException("Email é obrigatório");
        }
        if (email.trim().length() > 150 || !EMAIL.matcher(email.trim()).matches()) {
            throw new RequisicaoInvalidaException("Email inválido");
        }
        if (vazio(cnpj)) {
            throw new RequisicaoInvalidaException("CNPJ é obrigatório");
        }
        if (!Cnpj.valido(cnpj)) {
            throw new RequisicaoInvalidaException("CNPJ inválido");
        }
    }

    private static void validarLogin(String login) {
        if (vazio(login)) {
            throw new RequisicaoInvalidaException("Login é obrigatório");
        }
        if (!LOGIN.matcher(login.trim()).matches()) {
            throw new RequisicaoInvalidaException(
                    "Login deve ter de 3 a 50 caracteres: letras, números, ponto, hífen ou sublinhado");
        }
    }

    private static void validarSenha(String senha) {
        if (vazio(senha)) {
            throw new RequisicaoInvalidaException("Senha é obrigatória");
        }
        if (senha.length() < 6 || senha.getBytes(StandardCharsets.UTF_8).length > 72) {
            throw new RequisicaoInvalidaException("Senha deve ter entre 6 e 72 caracteres");
        }
    }

    private static boolean vazio(String valor) {
        return valor == null || valor.isBlank();
    }
}
