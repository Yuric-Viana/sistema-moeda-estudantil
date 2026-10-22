package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.InstituicaoEnsino;
import java.util.UUID; import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface InstituicaoRepository extends JpaRepository<InstituicaoEnsino,UUID> {
 List<InstituicaoEnsino> findAllByOrderByNome();
}
