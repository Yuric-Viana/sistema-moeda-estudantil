package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.EmpresaParceira;

import java.util.UUID;

public record EmpresaParceiraResponse(
        UUID id,
        String razaoSocial,
        String email,
        String cnpj,
        String login
) {

    public static EmpresaParceiraResponse de(EmpresaParceira empresa) {
        return new EmpresaParceiraResponse(
                empresa.getId(),
                empresa.getRazaoSocial(),
                empresa.getEmail(),
                empresa.getCnpj(),
                empresa.getLogin()
        );
    }
}
