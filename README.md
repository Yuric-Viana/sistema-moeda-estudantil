# 🪙 Sistema de Moeda Estudantil

Sistema para estimular o reconhecimento do mérito estudantil por meio de uma moeda virtual: professores distribuem moedas aos alunos como reconhecimento, e os alunos trocam essas moedas por produtos e descontos oferecidos por empresas parceiras.

> 📚 Projeto desenvolvido para a disciplina **Laboratório de Projeto de Software** — PUC Minas, Laboratório 3, 2º semestre/2026
>
> 👩‍🏫 Profa. Milena Menezes Adão

---

## 📌 Sumário

- [📖 Sobre](#-sobre)
- [🎯 Objetivo](#-objetivo)
- [👥 Atores](#-atores)
- [🗂️ Casos de Uso](#️-casos-de-uso)
- [📝 Histórias de Usuário](#-histórias-de-usuário)
- [⚙️ Regras de Negócio](#️-regras-de-negócio)
- [🗺️ Diagrama de Caso de Uso](#️-diagrama-de-caso-de-uso)
- [🧩 Diagrama de Classes](#-diagrama-de-classes)
- [🗄️ Modelo Entidade-Relacionamento (ER)](#️-modelo-entidade-relacionamento-er)
- [🏗️ Diagrama de Componentes](#️-diagrama-de-componentes)
- [🎓 API — Alunos](#-api--alunos)
- [🧪 Testes da Lab03S03](#-testes-da-lab03s03)
- [📊 Apresentação da Lab03S03](#-apresentação-da-lab03s03)
- [🚀 Status do Projeto](#-status-do-projeto)
- [✍️ Autores](#️-autores)

---

## 📖 Sobre

O **Sistema de Moeda Estudantil** é uma plataforma de reconhecimento de mérito acadêmico baseada em uma moeda virtual. A cada semestre, professores vinculados às instituições parceiras recebem um montante de moedas que podem distribuir aos seus alunos por bom comportamento, participação em aula e outros motivos. Os alunos acumulam essas moedas e as trocam por vantagens cadastradas por empresas parceiras, como descontos em restaurantes da universidade, desconto de mensalidade ou compra de materiais específicos.

O sistema conecta três perfis de usuário: aluno, professor e empresa parceira. Também se integra a um serviço de envio de emails, responsável por notificar o recebimento de moedas e por entregar os cupons de resgate.

## 🎯 Objetivo

Fornecer uma solução centralizada que permita:

- ✅ Cadastrar alunos e empresas parceiras no sistema de mérito
- ✅ Creditar semestralmente moedas aos professores, de forma acumulável
- ✅ Permitir que professores reconheçam alunos com envio de moedas e motivo obrigatório
- ✅ Notificar o aluno por email a cada reconhecimento recebido
- ✅ Permitir a consulta de extrato de conta por professores e alunos
- ✅ Permitir que empresas parceiras cadastrem vantagens com descrição, foto e custo em moedas
- ✅ Permitir que alunos resgatem vantagens, debitando o valor do seu saldo
- ✅ Gerar e enviar por email o código do cupom ao aluno e ao parceiro, para conferência da troca
- ✅ Garantir o acesso autenticado de todos os perfis de usuário

## 👥 Atores

| Ator | Descrição |
|---|---|
| 🎒 **Aluno** | Realiza seu próprio cadastro, consulta extrato e troca moedas por vantagens |
| 👩‍🏫 **Professor** | Pré-cadastrado pela instituição; distribui moedas aos alunos e consulta seu extrato |
| 🏢 **Empresa Parceira** | Realiza seu cadastro e mantém as vantagens oferecidas aos alunos |
| 🏫 **Instituição de Ensino** | Pré-cadastrada no sistema; envia a lista de professores no momento da parceria |
| 📧 **Serviço de Email** *(externo)* | Recebe as solicitações de envio de notificações e de cupons de resgate |

## 🗂️ Casos de Uso

### 🔑 Comuns a todos os perfis

| Caso de uso | Ator | Descrição |
|---|---|---|
| **UC01** — Autenticar no sistema | Aluno, Professor, Empresa Parceira | Acessa o sistema por meio de login e senha |

### 🎒 Aluno

| Caso de uso | Descrição |
|---|---|
| **UC02** — Cadastrar-se como aluno | Informa nome, email, CPF, RG, endereço, login e senha, e seleciona a instituição de ensino e o curso |
| **UC03** — Consultar extrato da conta | Visualiza o saldo atual de moedas e o histórico de recebimentos e trocas *(compartilhado com o Professor)* |
| **UC04** — Consultar vantagens disponíveis | Lista as vantagens cadastradas pelas empresas parceiras, com descrição, foto e custo |
| **UC05** — Resgatar vantagem | Seleciona uma vantagem e tem o custo debitado do saldo; inclui **UC10** (gera o código) e **UC11** (envia o cupom ao aluno e o comprovante ao parceiro) |

### 👩‍🏫 Professor

| Caso de uso | Descrição |
|---|---|
| **UC03** — Consultar extrato da conta | Visualiza o saldo atual de moedas e o histórico de envios realizados |
| **UC06** — Enviar moedas a um aluno | Seleciona o aluno, informa o montante e o motivo do reconhecimento; inclui **UC11** (notifica o aluno por email) |

### 🏢 Empresa Parceira

| Caso de uso | Descrição |
|---|---|
| **UC07** — Cadastrar-se como empresa parceira | Informa os dados da empresa, login e senha |
| **UC08** — Manter vantagens | Cadastra, altera e remove vantagens, informando descrição, foto e custo em moedas |

### ⚙️ Casos de uso do sistema

| Caso de uso | Ator | Descrição |
|---|---|---|
| **UC09** — Creditar moedas semestrais aos professores | Tempo | A cada semestre, adiciona 1.000 moedas ao saldo corrente de cada professor |
| **UC10** — Gerar código de cupom | — | Gera o código que identifica o resgate e é enviado ao aluno e ao parceiro |
| **UC11** — Enviar email | Serviço de Email | Aciona o serviço externo para notificar o aluno sobre moedas recebidas e para entregar cupom (aluno) e comprovante (parceiro) com o código gerado |

## 📝 Histórias de Usuário

### 🎒 Aluno

- Como aluno, quero me cadastrar no sistema informando meus dados pessoais e selecionando minha instituição e curso, para poder participar do sistema de mérito.
- Como aluno, quero fazer login no sistema, para acessar minhas funcionalidades com segurança.
- Como aluno, quero ser notificado por email quando receber moedas, para saber que fui reconhecido e por qual motivo.
- Como aluno, quero consultar o extrato da minha conta, para visualizar meu saldo de moedas e as transações que realizei.
- Como aluno, quero visualizar as vantagens disponíveis com descrição, foto e custo, para decidir no que gastar minhas moedas.
- Como aluno, quero resgatar uma vantagem usando meu saldo, para aproveitar o benefício oferecido pela empresa parceira.
- Como aluno, quero receber por email um cupom com código após o resgate, para utilizá-lo na troca presencial.

### 👩‍🏫 Professor

- Como professor, quero fazer login no sistema, para acessar minhas funcionalidades.
- Como professor, quero receber 1.000 moedas a cada semestre, de forma acumulável, para ter como reconhecer meus alunos ao longo do curso.
- Como professor, quero enviar moedas a um aluno informando o motivo do reconhecimento, para valorizar seu bom comportamento e participação em aula.
- Como professor, quero consultar o extrato da minha conta, para acompanhar meu saldo e os envios que já realizei.

### 🏢 Empresa Parceira

- Como empresa parceira, quero me cadastrar no sistema, para oferecer vantagens aos alunos participantes.
- Como empresa parceira, quero cadastrar vantagens com descrição, foto e custo em moedas, para divulgar o que ofereço aos alunos.
- Como empresa parceira, quero alterar e remover as vantagens que cadastrei, para manter minhas ofertas atualizadas.
- Como empresa parceira, quero receber por email o código do cupom resgatado por um aluno, para conferir a troca no momento do atendimento.

### 📧 Serviço de Email *(integração)*

- Como sistema de moeda estudantil, quero acionar o serviço de email a cada recebimento de moedas e a cada resgate de vantagem, para que aluno e parceiro sejam informados e possam conferir a transação pelo código gerado.

## ⚙️ Regras de Negócio

- 🔑 Alunos, professores e empresas parceiras possuem login e senha, e toda operação exige autenticação.
- 🏫 As instituições de ensino já estão pré-cadastradas no sistema, para seleção pelo aluno.
- 👩‍🏫 Os professores já estão pré-cadastrados no sistema, a partir da lista enviada pela instituição no momento da parceria, e armazenam nome, CPF e departamento, sempre vinculados a uma instituição.
- 🪙 Cada professor recebe 1.000 moedas por semestre, e esse total é **acumulável**: moedas não distribuídas permanecem no saldo corrente quando o novo crédito é feito.
- 💸 O professor só pode enviar moedas se possuir saldo suficiente para o montante informado.
- ✍️ O motivo do reconhecimento é uma mensagem aberta e de preenchimento **obrigatório** no envio de moedas.
- 📩 O aluno é notificado por email a cada recebimento de moedas.
- 📉 O resgate de uma vantagem debita o custo em moedas do saldo do aluno.
- 🎟️ Todo resgate gera um código pelo sistema, enviado por email tanto ao aluno (cupom) quanto à empresa parceira (conferência).
- 🧾 Toda vantagem cadastrada deve possuir descrição, foto do produto e custo em moedas.
- 📊 O extrato apresenta o saldo atual e as transações do usuário: envios, no caso do professor; recebimentos e trocas, no caso do aluno.

## 🗺️ Diagrama de Caso de Uso

![Diagrama de Caso de Uso](docs/diagrama-casos-de-uso.png)

## 🧩 Diagrama de Classes

![Diagrama de Classes](docs/sistema_moeda_estudantil_01.jpg)
![Diagrama de Classes](docs/sistema_moeda_estudantil_02.jpg)
![Diagrama de Classes](docs/sistema_moeda_estudantil_03.jpg)

## 🗄️ Modelo Entidade-Relacionamento (ER)

O Modelo Entidade-Relacionamento (ER) representa a estrutura
do banco de dados do Sistema de Moeda Estudantil, desenvolvido
a partir do diagrama de classes.

O modelo apresenta as entidades, seus atributos, chaves
primárias (PK), chaves estrangeiras (FK) e cardinalidades
dos relacionamentos.

![Modelo Entidade-Relacionamento (ER)](docs/modelo_ER.drawio.png)

## 🏗️ Diagrama de Componentes

![Diagrama de Componentes](docs/diagrama_componentes_mvc.jpg)

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| **Back-end** | Java 17, Spring Boot 4.1, Spring Web MVC, Spring Data JPA (Hibernate) |
| **Banco de dados** | MySQL 9 |
| **Segurança** | BCrypt (`spring-security-crypto`) para o hash das senhas |
| **Front-end** | Next.js, React, TypeScript e Tailwind CSS |
| **Build** | Maven (wrapper `mvnw` incluso no projeto) |

## 🏛️ Arquitetura e Acesso a Dados

O back-end segue a arquitetura em camadas (MVC), exposta como uma **API REST** consumida pelo front-end:

```
Front-end (Next.js)  ──HTTP/JSON──▶  Controller  ──▶  Service  ──▶  Repository  ──▶  MySQL
                                        │              │               │
                                       DTOs      regras de negócio   JPA / Hibernate
```

| Camada | Pacote | Responsabilidade |
|---|---|---|
| **Controller** | `controller` | Recebe as requisições HTTP e devolve as respostas |
| **Service** | `service` | Concentra as regras de negócio e as transações |
| **Repository** | `repository` | Acesso ao banco via Spring Data JPA |
| **Model** | `model` | Entidades JPA mapeadas para as tabelas |
| **DTO** | `dto` | Objetos de entrada e saída da API (a senha nunca é devolvida) |
| **Exception** | `exception` | Exceções de negócio e tratamento centralizado de erros |
| **Config** | `config` | Configurações (codificador de senhas, CORS) |

**Estratégia de acesso ao banco: ORM.** O mapeamento objeto-relacional é feito com **JPA/Hibernate**:

- As entidades são classes Java anotadas, e o Hibernate gera e executa o SQL.
- `Usuario` é uma classe abstrata com herança do tipo `JOINED`: cada perfil (como `EmpresaParceira`) tem a sua própria tabela, ligada à tabela `usuario` pela chave primária compartilhada. Isso evita colunas vazias e permite reutilizar login e senha entre os perfis.
- Os identificadores são `UUID`.
- As senhas são armazenadas apenas como hash **BCrypt**.
- Nesta fase, o esquema é atualizado automaticamente pelo Hibernate (`ddl-auto=update`). Quando o modelo ER estiver fechado, a ideia é migrar para `validate` com um script SQL versionado.
## 📁 Estrutura do Repositório

```
sistema-moeda-estudantil/
├── backend/
│   └── src/main/java/br/com/sistemamoedaestudantil/
│       └── sistema_moeda_estudantil/
│           ├── config/
│           ├── controller/
│           ├── dto/
│           ├── exception/
│           ├── model/
│           ├── repository/
│           └── service/
├── frontend/
│   └── app/
│       ├── alunos/page.tsx
│       └── empresas/page.tsx
├── database/
│   └── 03_alunos_instituicoes_cursos.sql
├── docs/
│   ├── modelo_ER.drawio.png
│   └── Lab03S03_Pessoa1/
├── tests/
│   └── teste-api-alunos.ps1
└── README.md
```

## ▶️ Como Executar

**Pré-requisitos:** Java 17 ou superior, Node.js 20 ou superior e MySQL em execução em `localhost:3306`.

**1. Banco de dados**

O banco `moeda_estudantil` é criado automaticamente na primeira execução. Por padrão a aplicação usa o usuário `root` sem senha; para usar outras credenciais, defina as variáveis de ambiente:

```bash
export DB_USER=seu_usuario
export DB_PASSWORD=sua_senha
```

**2. Back-end** (porta 8080)

```bash
cd backend
./mvnw spring-boot:run
```

**3. Front-end** (porta 3000)

```bash
cd frontend
npm install
npm run dev
```

Com os dois em execução, acesse `http://localhost:3000/empresas`.

### Executando no Windows (PowerShell)

**1. Iniciar o MySQL**

Verifique se o serviço está funcionando:

```powershell
Get-Service MySQL84
```

Se estiver parado, inicie-o pelo PowerShell como administrador:

```powershell
Start-Service MySQL84
```

Caso o serviço não esteja configurado corretamente, será necessário corrigir sua configuração antes de utilizá-lo.

**2. Iniciar o back-end**

```powershell
cd backend
$env:DB_USER="root"
$env:DB_PASSWORD="SUA_SENHA_MYSQL"
.\mvnw.cmd spring-boot:run
```

**3. Iniciar o front-end**

Em outro terminal, a partir da raiz do repositório:

```powershell
cd frontend
npm install
npm run dev
```

**4. Acessar as interfaces**

- Alunos: http://localhost:3000/alunos
- Empresas Parceiras: http://localhost:3000/empresas


## 🔌 API — Empresa Parceira

Base: `/api/empresas-parceiras`

| Método | Rota | Descrição | Respostas |
|---|---|---|---|
| `POST` | `/` | Cadastra uma empresa parceira | `201`, `409` |
| `GET` | `/` | Lista as empresas cadastradas | `200` |
| `GET` | `/{id}` | Busca uma empresa pelo id | `200`, `404` |
| `PUT` | `/{id}` | Atualiza razão social, email e CNPJ | `200`, `404`, `409` |
| `DELETE` | `/{id}` | Remove a empresa | `204`, `404` |

Exemplo de cadastro:

```json
{
  "razaoSocial": "Restaurante Exemplo LTDA",
  "email": "contato@exemplo.com",
  "cnpj": "12.345.678/0001-90",
  "login": "restaurante",
  "senha": "senha123"
}
```

Login, CNPJ e email são únicos: duplicidades retornam `409` com `{"erro": "..."}`. A resposta nunca inclui a senha.

## 🎓 API — Alunos

O módulo de Alunos permite cadastrar, listar, consultar, editar e excluir alunos, com persistência no MySQL utilizando Spring Data JPA e Hibernate.

### Endpoints

Base: `/api/alunos`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/alunos` | Cadastra um aluno |
| `GET` | `/api/alunos` | Lista os alunos cadastrados |
| `GET` | `/api/alunos/{id}` | Consulta um aluno pelo ID |
| `PUT` | `/api/alunos/{id}` | Atualiza os dados de um aluno |
| `DELETE` | `/api/alunos/{id}` | Exclui um aluno |

### Instituições e cursos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/instituicoes` | Lista as instituições de ensino |
| `GET` | `/api/instituicoes/{id}/cursos` | Lista os cursos de uma instituição |

As instituições e os cursos são previamente cadastrados no banco de dados. Durante o cadastro, o aluno seleciona uma instituição e um dos cursos vinculados a ela.

### Exemplo de cadastro

```json
{
  "nome": "Aluno Exemplo",
  "email": "aluno@example.com",
  "cpf": "12345678909",
  "rg": "MG12345678",
  "endereco": "Rua Exemplo, 100",
  "login": "alunoexemplo",
  "senha": "senha123",
  "instituicaoId": "UUID_DA_INSTITUICAO",
  "cursoId": "UUID_DO_CURSO"
}
```

### Regras de validação

- Todos os dados obrigatórios devem ser preenchidos.
- O CPF deve conter 11 dígitos.
- A senha deve possuir no mínimo 6 caracteres no cadastro.
- Login, e-mail e CPF não podem estar duplicados.
- O curso selecionado deve pertencer à instituição informada.
- As senhas são armazenadas utilizando hash BCrypt e não são retornadas nas respostas da API.

### Persistência

O módulo utiliza as entidades `Usuario`, `Aluno`, `InstituicaoEnsino` e `Curso`.

A entidade `Aluno` herda os campos de autenticação de `Usuario`, utilizando a estratégia de herança `JOINED`. Cada aluno está vinculado a um curso, e cada curso pertence a uma instituição de ensino.

## 🧪 Testes da Lab03S03

Para verificar o funcionamento do módulo de Alunos, foi preparado um roteiro de testes das operações CRUD.

Com o MySQL e o back-end em execução, o teste pode ser iniciado no PowerShell, a partir da raiz do repositório:

```powershell
.\tests\teste-api-alunos.ps1
```

O roteiro contempla cadastro, consulta, atualização e exclusão de aluno.

Também podem ser executados os comandos:

**Back-end:**

```powershell
cd backend
.\mvnw.cmd clean test
```

**Front-end:**

```powershell
cd frontend
npm run build
```

A realização desses testes deve ser confirmada antes da entrega final.

## 📊 Apresentação da Lab03S03

A Sprint Lab03S03 contempla a finalização dos CRUDs de Alunos e Empresas Parceiras, além da apresentação da arquitetura e da camada de persistência do sistema.

A apresentação aborda:

- Arquitetura em camadas e comunicação por API REST.
- Organização em Controller, Service, Repository, Model e DTO.
- Persistência com Spring Data JPA, Hibernate e MySQL.
- Modelo Entidade-Relacionamento e cardinalidades.
- Demonstração das operações CRUD.

**Materiais da Pessoa 1:**

- [Slides da apresentação](docs/Lab03S03_Pessoa1/apresentacao_yuri_Lab03S03.pptx)
- [Roteiro de apresentação](docs/Lab03S03_Pessoa1/ROTEIRO_APRESENTACAO.md)
- [Checklist da entrega](docs/Lab03S03_Pessoa1/CHECKLIST_ENTREGA.md)

## 🚀 Status do Projeto

- [x] Lab03S01 — Diagrama de Casos de Uso + Histórias de Usuário + Diagrama de Classes + Diagrama de Componentes
- [x] Lab03S02 — Modelo ER (concluído), estratégia de acesso ao banco de dados e CRUDs de aluno e empresa parceira (em desenvolvimento)
- [ ] Lab03S03 — CRUDs de aluno e empresa parceira (versão final) + apresentação da arquitetura e da camada de persistência

## ✍️ Autores

- Júlia de Souza Ventura
- Yuri Cardoso Viana

---

<p align="center">Desenvolvido para a disciplina de Projeto de Software — PUC Minas 💜</p>
