package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model;
import jakarta.persistence.*;
import java.util.UUID;
@Entity @Table(name="curso")
public class Curso {
 @Id @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR) @Column(length=36) private UUID id;
 @Column(nullable=false,length=150) private String nome;
 @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="instituicao_id") private InstituicaoEnsino instituicao;
 public UUID getId(){return id;} public String getNome(){return nome;}
 public InstituicaoEnsino getInstituicao(){return instituicao;}
}
