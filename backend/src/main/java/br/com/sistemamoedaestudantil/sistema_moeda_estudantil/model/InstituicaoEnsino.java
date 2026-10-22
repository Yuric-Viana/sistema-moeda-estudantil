package br.com.sistemamoedaestudantil.sistema_moeda_estudantil.model;
import jakarta.persistence.*;
import java.util.UUID;
@Entity @Table(name="instituicao_ensino")
public class InstituicaoEnsino {
 @Id @org.hibernate.annotations.JdbcTypeCode(org.hibernate.type.SqlTypes.CHAR) @Column(length=36) private UUID id;
 @Column(nullable=false,unique=true,length=150) private String nome;
 public UUID getId(){return id;} public String getNome(){return nome;}
}
