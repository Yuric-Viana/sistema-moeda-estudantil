package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.service;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.dto.*;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model.*;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.repository.*;
import br.com.sistemamoedaestudantil.sistema_moeda_estudantil.util.Cpf;
import java.nio.charset.StandardCharsets;
import java.util.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AlunoService {
 private final AlunoRepository alunos; private final UsuarioRepository usuarios;
 private final CursoRepository cursos; private final PasswordEncoder encoder;
 public AlunoService(AlunoRepository alunos,UsuarioRepository usuarios,CursoRepository cursos,PasswordEncoder encoder){
  this.alunos=alunos;this.usuarios=usuarios;this.cursos=cursos;this.encoder=encoder;
 }
 @Transactional(readOnly=true) public List<AlunoResponse> listar(){return alunos.findAll().stream().map(this::resposta).toList();}
 @Transactional(readOnly=true) public AlunoResponse buscar(UUID id){return resposta(exigirAluno(id));}
 @Transactional public AlunoResponse cadastrar(AlunoRequest req){
  validar(req,true);
  conferirUnicidade(req,null);
  Curso curso=exigirCurso(req);
  Aluno aluno=new Aluno(); aluno.setLogin(req.login().trim()); aluno.setSenhaHash(encoder.encode(req.senha()));
  preencher(aluno,req,curso);
  return resposta(alunos.saveAndFlush(aluno));
 }
 @Transactional public AlunoResponse editar(UUID id,AlunoRequest req){
  validar(req,false); Aluno aluno=exigirAluno(id); conferirUnicidade(req,id);
  Curso curso=exigirCurso(req);
  aluno.setLogin(req.login().trim());
  if(req.senha()!=null && !req.senha().isBlank()) aluno.setSenhaHash(encoder.encode(req.senha()));
  preencher(aluno,req,curso);
  return resposta(alunos.saveAndFlush(aluno));
 }
 @Transactional public void excluir(UUID id){Aluno aluno=exigirAluno(id); alunos.delete(aluno); alunos.flush();}
 private void validar(AlunoRequest r,boolean cadastro){
  if(r==null) throw erro(HttpStatus.BAD_REQUEST,"Dados do aluno são obrigatórios");
  if(vazio(r.nome())) throw erro(HttpStatus.BAD_REQUEST,"Nome é obrigatório");
  if(r.nome().trim().length()>150) throw erro(HttpStatus.BAD_REQUEST,"Nome deve ter no máximo 150 caracteres");
  if(vazio(r.email())) throw erro(HttpStatus.BAD_REQUEST,"Email é obrigatório");
  if(r.email().trim().length()>180 || !r.email().trim().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) throw erro(HttpStatus.BAD_REQUEST,"Email inválido");
  if(vazio(r.cpf())) throw erro(HttpStatus.BAD_REQUEST,"CPF é obrigatório");
  if(!Cpf.valido(r.cpf().trim())) throw erro(HttpStatus.BAD_REQUEST,"CPF inválido");
  if(vazio(r.rg())) throw erro(HttpStatus.BAD_REQUEST,"RG é obrigatório");
  if(r.rg().trim().length()>30) throw erro(HttpStatus.BAD_REQUEST,"RG deve ter no máximo 30 caracteres");
  if(vazio(r.endereco())) throw erro(HttpStatus.BAD_REQUEST,"Endereço é obrigatório");
  if(r.endereco().trim().length()>255) throw erro(HttpStatus.BAD_REQUEST,"Endereço deve ter no máximo 255 caracteres");
  if(vazio(r.login())) throw erro(HttpStatus.BAD_REQUEST,"Login é obrigatório");
  if(!r.login().trim().matches("^[A-Za-z0-9._-]{3,50}$")) throw erro(HttpStatus.BAD_REQUEST,"Login deve ter de 3 a 50 caracteres: letras, números, ponto, hífen ou sublinhado");
  if(r.instituicaoId()==null) throw erro(HttpStatus.BAD_REQUEST,"Instituição é obrigatória");
  if(r.cursoId()==null) throw erro(HttpStatus.BAD_REQUEST,"Curso é obrigatório");
  if(cadastro && vazio(r.senha())) throw erro(HttpStatus.BAD_REQUEST,"Senha é obrigatória");
  if(!vazio(r.senha()) && (r.senha().length()<6 || r.senha().getBytes(StandardCharsets.UTF_8).length>72)) throw erro(HttpStatus.BAD_REQUEST,"Senha deve ter entre 6 e 72 caracteres");
 }
 private boolean vazio(String s){return s==null || s.isBlank();}
 private Aluno exigirAluno(UUID id){return alunos.findById(id).orElseThrow(()->erro(HttpStatus.NOT_FOUND,"Aluno não encontrado"));}
 private Curso exigirCurso(AlunoRequest req){
  Curso c=cursos.findById(req.cursoId()).orElseThrow(()->erro(HttpStatus.BAD_REQUEST,"Curso inválido"));
  if(!c.getInstituicao().getId().equals(req.instituicaoId())) throw erro(HttpStatus.BAD_REQUEST,"Curso não pertence à instituição selecionada");
  return c;
 }
 private void conferirUnicidade(AlunoRequest req,UUID id){
  String login=req.login().trim();String email=req.email().trim().toLowerCase();String cpf=req.cpf().trim();
  boolean existeLogin=id==null ? usuarios.existsByLogin(login) : (!exigirAluno(id).getLogin().equals(login) && usuarios.existsByLogin(login));
  boolean existeEmail=id==null?alunos.existsByEmail(email):alunos.existsByEmailAndIdNot(email,id);
  boolean existeCpf=id==null?alunos.existsByCpf(cpf):alunos.existsByCpfAndIdNot(cpf,id);
  if(existeLogin||existeEmail||existeCpf) throw erro(HttpStatus.CONFLICT,"Login, e-mail ou CPF já cadastrado");
 }
 private void preencher(Aluno a,AlunoRequest r,Curso c){a.setNome(r.nome().trim());a.setEmail(r.email().trim().toLowerCase());a.setCpf(r.cpf().trim());a.setRg(r.rg().trim());a.setEndereco(r.endereco().trim());a.setCurso(c);}
 private AlunoResponse resposta(Aluno a){Curso c=a.getCurso();InstituicaoEnsino i=c.getInstituicao();return new AlunoResponse(a.getId(),a.getNome(),a.getEmail(),a.getCpf(),a.getRg(),a.getEndereco(),a.getLogin(),i.getId(),i.getNome(),c.getId(),c.getNome());}
 private ResponseStatusException erro(HttpStatus status,String msg){return new ResponseStatusException(status,msg);}
}