# **Configurações do Projeto - CP-Planta**

## Sumário
- [Configurações Gerais](#configurações-gerais)
  - [Instalação do Ambiente de Desenvolvimento](#instalação-do-ambiente-de-desenvolvimento)
- [Backend](#backend)
  - [Configurando o Backend](#configurando-o-backend)
  - [Rodando o Backend](#rodando-o-backend)
  - [Banco de Dados](#banco-de-dados)
- [ORM Client](#orm-client)
  - [Prisma Client](#prisma-client)
- [Extras](#extras)
  - [PGadmin4](#pgadmin4)
- [Estou com pressa: Resumo](#resumo-dos-passos)

> **Observação:** Consulte a documentação do projeto no menu [Instalação](https://tools.ages.pucrs.br/cp-planta/wiki/-/wikis/instalacao) para mais detalhes sobre o processo.

## **Configurações Gerais**

### **Instalação do Ambiente de Desenvolvimento**

Antes de configurar os ambientes, siga estas instruções gerais:

- **VSCode**: Baixe [aqui](https://code.visualstudio.com/download).

- **Plugins recomendados para VSCode**:  
  - ESLint
  - Prettier
  - Jest
  - Jest Runner
  - GitHub Copilot (opcional).

- **NodeJS**: Verifique se o Node está instalado:

  ```bash
  node --version
  ```

  Caso não esteja, siga o [tutorial oficial](https://nodejs.org/en/download/).

- **NPM**: O NPM já vem com o NodeJS. Verifique a versão:

  ```bash
  npm --version
  ```

- **YARN**: Caso queira utilizar o yarn, precisa verificar se está instalado:

  ```bash
  yarn --version
  ```

  para instalar:

    ```bash
  npm install --global yarn
  ```

---

## **Backend**

### **Configurando o Backend**

1. **Instalar Node (versão 18.0 ou superior)**:
   - Para Windows: [Download Node.js](https://nodejs.org/en/download/package-manager/)
   - Para Linux:

     ```bash
     sudo apt install nodejs
     ```

2. **Clonar o repositório do Backend**:

   ```bash
   git clone https://tools.ages.pucrs.br/cp-planta/backend.git
   ```

3. **Instalar dependências**:
   - No terminal, dentro do diretório do projeto:

     ```bash
     npm install
     ```

     usando yarn:

     ```bash
     yarn install
     ```

4. **Configurar variáveis de ambiente**:
   - Renomeie o arquivo `.envExample` para `.env`.(caso já possua o .env, desconsidere.)

## **Rodando o Backend**

### **Modo de Desenvolvimento**

- Para rodar o backend em modo de desenvolvimento:

  ```bash
  npm run dev
  ```

  usando yarn:

  ```bash
  yarn start dev
  ```

ou algo como:

  ```bash
  yarn dev
  ```

- O projeto estará disponível em:  
  [http://localhost:3000](http://localhost:3000)

### **Rodando com Docker**

- Se desejar usar Docker, rode os seguintes comandos:

  ```bash
  docker-compose build
  docker-compose up -d
  ```

  se usa wsl, seu comando pode ser algo como:

  ```bash
  docker compose up -d
  ```

- O backend estará acessível em:  
  [http://localhost:3000](http://localhost:3000)

---

## **Banco de Dados**

### **PostgreSQL**

1. **Download do PostgreSQL**: Baixe [aqui](https://www.postgresql.org/download/).
2. **PgAdmin 4**: Para gerenciar os bancos de dados, use o [PgAdmin 4](https://www.pgadmin.org/download/).

### **Postman/Insomnia**

- Teste suas APIs usando o [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/download).

---

## **ORM Client**

### **Prisma Client**

Para realizar a interface entre o banco de dados e a aplicação, vamos utilizar o ORM Prisma (incuso no backend).
Para isso vamos gerar o Prisma Client:

  ```bash
  npx prisma generate
  ```

Para consultar os dados do banco de dados no seu browser, use:

  ```bash
  npx prisma studio
  ```

---

## **Extras**

### **PGadmin4**

Caso necessite realizar ações mais avançadas, como:

- Criar scripts CRUD
- Alterar dados diretamente no banco de dados
- Criar views, procedures, index...
- Verificar campos, conferir dados no banco, etc.

Você pode utilizar o administrador **Pgadmin4**, que é o padrão do PostgreSQL.  
Ele já está incluído no Docker, mas você pode instalá-lo localmente, assim como o banco de dados.

### Para configurar o acesso

Usando o Pgadmin do container Docker, será necessário informar os dados da rede interna dos containers.  
Para obter os nomes, abra um novo terminal e digite:

```bash
docker ps
```

Acesse em seu navegador o endereço: [http://localhost:1234/](http://localhost:1234/)  
**Login:** <fulano@gmail.com>  
**Senha:** abc123

Uma vez rodando coloque:

Name: *(qualquer nome)*
host/connection: database
port: 5432
Maintanance database: postgres
username: postgres
password: postgres

#### Registrar o servidor

- **Aba Geral**  
  - **Nome:** postgres  
  - **Grupo de Servidores:** Servers

- **Aba Conexão**  
  - **Host name/address:** backend-database-1  
  - **Port:** 5432  
  - **Maintenance database:** postgres  
  - **Username:** postgres  
  - **Senha:** postgres

> **Observação:** Os dados de acesso podem variar. Consulte o arquivo *.env* do projeto: [environments](./.env) para verificar os dados.
---

Caso queira usar o Pgadmin já instalado em sua máquina, use as portas expostas pelos containers:

- **Aba Geral**  
  - **Nome:** postgres  
  - **Grupo de Servidores:** Servers

- **Aba Conexão**  
  - **Host name/address:** localhost  
  - **Port:** 5435  
  - **Maintenance database:** postgres  
  - **Username:** postgres  
  - **Senha:** postgres

---

## **Resumo dos Passos**

### 1. **Configurações Gerais**

- **Instalar VSCode** e seus **plugins recomendados** (ESLint, Prettier, etc).
- **Instalar NodeJS e NPM**, verificar suas versões.
- **Instalar Yarn**, se preferir usá-lo.

### 2. **Configurar o Backend**

- **Clonar o repositório** do [backend](https://tools.ages.pucrs.br/cp-planta/backend.git).
- **Instalar as dependências** com `npm install` ou `yarn install`.
- **Configurar o arquivo .env**, renomeando o `.envExample`.

### 3. **Rodar o Backend**

- **Modo de desenvolvimento**: `npm run dev` ou `yarn dev`.
- **Rodar com Docker**: `docker-compose up -d` ou `docker compose up -d`.

### 4. **Banco de Dados**

- **Instalar PostgreSQL** e utilizar **PgAdmin 4** para gerenciar o banco.
- **Testar APIs** com ferramentas como **Postman** ou **Insomnia**.

### 5. **ORM Client - Prisma**

- **Gerar Prisma Client** com o comando `npx prisma generate`.
- **Visualizar dados no Prisma Studio**: `npx prisma studio`.

### 6. **Extras: Configuração do PgAdmin4**

- **Registrar o servidor** no PgAdmin4 para gerenciar o banco de dados.
- Acesse o PgAdmin através do endereço fornecido ou use a instalação local, utilizando as portas expostas pelos containers.

---

### Estrutura de diretórios (Backend)

```plaintext
/backend
├── .dockerignore
├── .env.example                   # Exemplo de arquivo de variáveis de ambiente
├── .eslintignore                  # Configuração do ESLint para ignorar arquivos
├── .eslintrc                      # Configuração do ESLint
├── .gitignore                     # Arquivos e diretórios a serem ignorados pelo Git
├── .gitpod.yml                    # Configuração do Gitpod
├── .husky/                        # Hooks do Git
│   ├── _/
│   ├── commit-msg
│   └── pre-commit
├── .nvmrc                         # Configuração da versão do Node.js
├── .prettierignore                # Configuração do Prettier para ignorar arquivos
├── .prettierrc                    # Configuração do Prettier
├── .releaserc                     # Configuração do Semantic Release
├── .vscode/                       # Configurações do Visual Studio Code
│   └── settings.json
├── CHANGELOG.md                   # Histórico de mudanças do projeto
├── commitlint.config.js           # Configuração do Commitlint
├── database/                      # Arquivos relacionados ao banco de dados
│   └── backup.sql                 # Backup do banco de dados
├── docker-compose.yml             # Configuração do Docker Compose
├── dockerfile.node                # Dockerfile para o ambiente Node.js
├── dockerfile.postgres            # Dockerfile para o ambiente PostgreSQL
├── jest.config.js                 # Configuração do Jest
├── LICENSE.md                     # Licença do projeto
├── nest-cli.json                  # Configuração do Nest CLI
├── package.json                   # Dependências e scripts do Node.js
├── prisma/                        # Configuração do Prisma
│   ├── migrations/                # Migrações do Prisma
│   ├── patterns.md                # Padrões de desenvolvimento
│   └── schema.prisma              # Esquema do Prisma
├── README.md                      # Documentação do projeto
├── scripts/                       # Scripts auxiliares
│   └── db_create.sql              # Script para criação do banco de dados
│   └── ...                        # Outros scripts
├── src/                           # Código fonte do projeto
│   ├── domain/                    # Camada de domínio (modelos, interfaces de repositórios)
│   │   ├── models/
│   │   │   └── User.ts            # Definição do modelo de usuário
│   │   └── repositories/
│   │       └── UserRepository.ts  # Interface do repositório de usuário
│   ├── application/               # Camada de aplicação (serviços, DTOs)
│   │   ├── services/
│   │   │   └── UserService.ts     # Serviço de usuário
│   │   └── dtos/
│   │       └── UserDTO.ts         # Objeto de Transferência de Dados de Usuário
│   ├── interfaces/                # Camada de interface (views, controladores)
│   │   ├── components/
│   │   │   └── UserProfile.tsx    # Componente React para o perfil do usuário
│   │   ├── views/
│   │   │   └── UserView.tsx       # Componente de visualização para a página de usuário
│   │   ├── controllers/
│   │   │   └── UserController.ts  # Controlador de usuário para lidar com requisições de API
│   │   ├── pages/                 # Páginas e roteamento do Next.js
│   │   │   └── user/
│   │   │       └── [id].tsx       # Rota dinâmica para a página de usuário
│   │   ├── styles/
│   │   │   └── globals.css        # Estilos globais usando Tailwind CSS
│   │   └── utils/
│   │       └── formatDate.ts      # Função utilitária para formatação de datas
│   ├── infrastructure/            # Camada de infraestrutura (implementações de repositórios, integrações)
│   │   └── repositories/
│   │       └── InMemoryUserRepository.ts  # Implementação do repositório de usuário em memória
│   └── tests/                     # Testes (testes unitários e de integração)
│       ├── unit/
│       │   └── UserService.spec.ts  # Teste unitário para UserService
│       └── integration/
│           └── UserController.spec.ts  # Teste de integração para UserController
├── tsconfig.build.json            # Configuração do TypeScript para build
├── tsconfig.json                  # Configuração do TypeScript
└── tsconfig.tsbuildinfo           # Informações de build do TypeScript
```

---
