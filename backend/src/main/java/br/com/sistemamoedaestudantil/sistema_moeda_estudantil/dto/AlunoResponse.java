package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto;
import java.util.UUID;
public record AlunoResponse(UUID id,String nome,String email,String cpf,String rg,String endereco,String login,
 UUID instituicaoId,String instituicaoNome,UUID cursoId,String cursoNome) {}
