CREATE TABLE IF NOT EXISTS instituicao_ensino (
 id CHAR(36) NOT NULL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL UNIQUE
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS curso (
 id CHAR(36) NOT NULL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL,
 instituicao_id CHAR(36) NOT NULL,
 CONSTRAINT fk_curso_instituicao FOREIGN KEY (instituicao_id) REFERENCES instituicao_ensino(id),
 CONSTRAINT uq_curso_instituicao_nome UNIQUE (instituicao_id,nome)
) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS aluno (
 usuario_id CHAR(36) NOT NULL PRIMARY KEY,
 nome VARCHAR(150) NOT NULL,
 email VARCHAR(180) NOT NULL UNIQUE,
 cpf VARCHAR(11) NOT NULL UNIQUE,
 rg VARCHAR(30) NOT NULL,
 endereco VARCHAR(255) NOT NULL,
 curso_id CHAR(36) NOT NULL,
 CONSTRAINT fk_aluno_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
 CONSTRAINT fk_aluno_curso FOREIGN KEY (curso_id) REFERENCES curso(id)
) ENGINE=InnoDB;
-- Dados de demonstração, não cadastros definitivos
INSERT IGNORE INTO instituicao_ensino (id,nome) VALUES
 ('11111111-1111-4111-8111-111111111111','PUC Minas'),
 ('22222222-2222-4222-8222-222222222222','Instituição Exemplo');
INSERT IGNORE INTO curso (id,nome,instituicao_id) VALUES
 ('33333333-3333-4333-8333-333333333333','Engenharia de Software','11111111-1111-4111-8111-111111111111'),
 ('44444444-4444-4444-8444-444444444444','Ciência da Computação','11111111-1111-4111-8111-111111111111'),
 ('55555555-5555-4555-8555-555555555555','Sistemas de Informação','22222222-2222-4222-8222-222222222222');
