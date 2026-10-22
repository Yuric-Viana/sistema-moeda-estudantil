package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Aluno;
import java.util.*;
import org.springframework.data.jpa.repository.*;
public interface AlunoRepository extends JpaRepository<Aluno,UUID> {
 boolean existsByEmail(String email);
 boolean existsByCpf(String cpf);
 boolean existsByEmailAndIdNot(String email,UUID id);
 boolean existsByCpfAndIdNot(String cpf,UUID id);
 @Override @EntityGraph(attributePaths={"curso","curso.instituicao"}) List<Aluno> findAll();
 @Override @EntityGraph(attributePaths={"curso","curso.instituicao"}) Optional<Aluno> findById(UUID id);
}
