package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;
import java.util.UUID;
public record AlunoRequest(
 String nome,
 String email,
 String cpf,
 String rg,
 String endereco,
 String login,
 String senha,
 UUID instituicaoId,
 UUID cursoId
) {}
