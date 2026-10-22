package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.EmpresaParceira;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EmpresaParceiraRepository extends JpaRepository<EmpresaParceira, UUID> {

    boolean existsByCnpj(String cnpj);

    boolean existsByEmail(String email);
}

