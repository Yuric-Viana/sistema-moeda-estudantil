package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

public record EmpresaParceiraRequest(
        String razaoSocial,
        String email,
        String cnpj,
        String login,
        String senha
) {
}
