package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.Curso;
import java.util.UUID; import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CursoRepository extends JpaRepository<Curso,UUID> {
 List<Curso> findByInstituicaoIdOrderByNome(UUID instituicaoId);
}
