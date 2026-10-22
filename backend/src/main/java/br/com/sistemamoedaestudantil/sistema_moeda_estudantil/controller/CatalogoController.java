package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.controller;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.OpcaoResponse;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.*;
import java.util.*;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api")
public class CatalogoController {
 private final InstituicaoRepository instituicoes; private final CursoRepository cursos;
 public CatalogoController(InstituicaoRepository i,CursoRepository c){instituicoes=i;cursos=c;}
 @GetMapping("/instituicoes") public List<OpcaoResponse> instituicoes(){return instituicoes.findAllByOrderByNome().stream().map(i->new OpcaoResponse(i.getId(),i.getNome())).toList();}
 @GetMapping("/instituicoes/{id}/cursos") public List<OpcaoResponse> cursos(@PathVariable UUID id){return cursos.findByInstituicaoIdOrderByNome(id).stream().map(c->new OpcaoResponse(c.getId(),c.getNome())).toList();}
}
