package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

public record EmpresaParceiraAtualizacaoRequest(
        String razaoSocial,
        String email,
        String cnpj
) {
}