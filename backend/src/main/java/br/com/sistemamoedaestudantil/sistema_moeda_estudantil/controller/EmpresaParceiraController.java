package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.controller;

import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraAtualizacaoRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraRequest;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.EmpresaParceiraResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service.EmpresaParceiraService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/empresas-parceiras")
public class EmpresaParceiraController {

    private final EmpresaParceiraService service;

    public EmpresaParceiraController(EmpresaParceiraService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<EmpresaParceiraResponse> cadastrar(@RequestBody EmpresaParceiraRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(request));
    }

    @GetMapping
    public List<EmpresaParceiraResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public EmpresaParceiraResponse buscarPorId(@PathVariable UUID id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public EmpresaParceiraResponse atualizar(@PathVariable UUID id,
                                             @RequestBody EmpresaParceiraAtualizacaoRequest request) {
        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable UUID id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}