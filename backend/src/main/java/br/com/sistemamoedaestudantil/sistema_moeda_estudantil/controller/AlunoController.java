package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.controller;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.*;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service.AlunoService;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/alunos")
public class AlunoController {
 private final AlunoService service;
 public AlunoController(AlunoService s){this.service=s;}
 @GetMapping public List<AlunoResponse> listar(){return service.listar();}
 @GetMapping("/{id}") public AlunoResponse buscar(@PathVariable UUID id){return service.buscar(id);}
 @PostMapping public ResponseEntity<AlunoResponse> cadastrar(@RequestBody AlunoRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(r));}
 @PutMapping("/{id}") public AlunoResponse editar(@PathVariable UUID id,@RequestBody AlunoRequest r){return service.editar(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void excluir(@PathVariable UUID id){service.excluir(id);}
}
