### Plano de Testes



### O que precisa criar?
- criar arquivo <nome-do-arquivo-original>.spec.ts
Exemplo: 
para categories ficaria assim: 
categories.service.spec.ts 
categories.controller.spec.ts

- criar o plano de testes 

DICA: verificar o módulo, e olhar como está validando no controller ou service e ver o schema do zod. 

- Será necessário fazer testes para o chamado "caminho feliz", que é quando recebe no payload do request tudo bonitinho como deveria ser, e também testes para capturar os erros (o teste dá sucesso quando captura corretamente o erro e a mensagem de erro)
quando executar os testes, vai aparecer no terminal o resultado e vai ajustando conforme necessário para pegar mensagem ou alterar os dados. 

- Será necessário também mockar dados para realizar os testes. Em hipótese alguma deve chamar arquivos externos ou fazer consultas reais ao banco. 

- O Husky tem implementado um script que, caso existam classes de teste (.spec ou .test) preparadas para commit, ele vai executar primeiro os testes, e se não passarem não vai permitir commitar os arquivos. Isso deve permanecer assim, para não quebrar o build da aplicação. Caso encontre problemas, busque auxílio com os AgesIII. 
A ordem de execução dos scripts do Husky é essa: 
- Prettier: para identação e formatação de código.
- ESLint (linter): revisão de código conforme boas práticas da linguagem, no caso typescript. 
- Testes: se houverem testes no staging, ele os executa antes de fazer o commit. 

Obs: quando você salva um arquivo no seu ambiente, os dois primeiros scripts são executados dentro do arquivo. 

Para executar os testes no seu ambiente, execute: 
```bash
npx jest path/to/file.spec.ts
```

Obs: todos os testes são implementados em inglês. Sem exceções.

DICA: existem extensões do jest para VSCode que podem ser úteis.

Ao escolher sua task:
- vincule seu user na task
- mova a task para **"em andamento"**
- Crie uma branch a partir da develop, mencionando a task, dessa forma: 
**"feature/#59-teste-unitario-users"**

Antes de concluir sua task, execute: 
```bash
git merge origin/develop
```
Corrija os conflitos e salve seu trabalho. Execute os testes novamente para verificar se as alterações vindas da develop não "quebraram" os testes. Estando tudo ok, faça commit e abra MR para a branch **DEVELOP** (verifique porque por padrão vai para a Master) e indique como revisor o **André**. Mova o card da sua task para "finalizada".

Dica: invista um tempo lendo a documentação do projeto e compreendendo a realização de testes unitários **antes** de começar a trabalhar de fato na task. Isso vai poupar tempo e esforços. 

### Exemplo de roteiro:

#### 1. Testes para o `CategoriesController`

- **Create (POST /categories)**
  - **Caminho Feliz**:
    - Validar que, ao enviar um `CreateCategoriesDto` com descrição válida e ativa, a categoria é criada com sucesso e o retorno contém `id`, `description`, `active`, `created_at` e `updated_at`.
  - **Erros**:
    - Erro de validação para descrição vazia ou com menos de 3 caracteres.
    - Categoria duplicada: validar se retorna erro caso a categoria já exista (com mensagem sugerindo atualização).
    - Categoria inativa com mesma descrição: verificar se retorna erro informando que a categoria já existe, mas está inativa.

- **findAll (GET /categories)**
  - **Caminho Feliz**:
    - Validar que a listagem retorna todas as categorias ativas ordenadas pelo campo solicitado (`id` ou `description`).
  - **Erros**:
    - Campo de ordenação inválido: verificar se retorna erro com uma mensagem informativa sobre os campos permitidos.

- **findById (GET /categories/:id)**
  - **Caminho Feliz**:
    - Validar que ao consultar por um `id` válido e ativo, a categoria correta é retornada.
  - **Erros**:
    - Formato de `id` inválido (não numérico): validar se retorna erro com mensagem adequada.
    - `id` inexistente ou inativo: verificar se retorna erro informando que a categoria não foi encontrada ou que está inativa.

- **update (PATCH /categories/:id)**
  - **Caminho Feliz**:
    - Validar atualização com `id` válido e `UpdateCategoriesDto` contendo campos válidos.
  - **Erros**:
    - `id` inválido (não numérico ou inexistente).
    - Campo de atualização inválido (não pertencente ao `UpdateCategoriesDto`).
    - Nenhum campo enviado para atualizar.
    - Categoria inativa: validar se retorna erro informando que a categoria está inativa.

- **remove (DELETE /categories/:id)**
  - **Caminho Feliz**:
    - Validar exclusão de uma categoria ativa por `id`.
  - **Erros**:
    - `id` inválido ou inexistente: verificar se retorna erro informando que o `id` não foi encontrado.
    - Categoria já inativa: verificar se retorna erro indicando que a categoria já foi desativada.

- **activate (POST /categories/activate/:id)**
  - **Caminho Feliz**:
    - Validar ativação de uma categoria inativa por `id`.
  - **Erros**:
    - `id` inexistente.
    - Categoria já ativa: verificar se retorna erro informando que a categoria já está ativa.


#### 2. Testes para o `CategoriesService`

- **create**
  - **Caminho Feliz**:
    - Validar que, ao criar uma nova categoria, a mesma é salva no repositório com os dados corretos.
  - **Erros**:
    - Categoria duplicada: ao tentar criar uma categoria com descrição já existente, deve retornar erro informando a duplicidade.

- **findAll**
  - **Caminho Feliz**:
    - Validar que todas as categorias ativas são retornadas corretamente ordenadas pelo campo especificado.
  - **Erros**:
    - Campo de ordenação inválido: deve retornar erro.

- **findById**
  - **Caminho Feliz**:
    - Validar que a busca por `id` retorna a categoria correta.
  - **Erros**:
    - Categoria não encontrada ou inativa: deve retornar erro informando que a categoria não foi localizada.

- **update**
  - **Caminho Feliz**:
    - Validar que uma categoria pode ser atualizada com os dados válidos e que as modificações são persistidas.
  - **Erros**:
    - `id` inexistente ou inativo.
    - Campos inválidos no `UpdateCategoriesDto`.

- **delete**
  - **Caminho Feliz**:
    - Validar que a exclusão marca a categoria como inativa.
  - **Erros**:
    - `id` inexistente ou inativo.

- **reactivateCategory**
  - **Caminho Feliz**:
    - Validar que a categoria inativa é reativada com sucesso.
  - **Erros**:
    - `id` inexistente ou categoria já ativa.

### Arquivo de Testes Exemplo 

Para estruturar os testes, usaremos a sintaxe do Jest para ilustrar os casos.

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('create', () => {
    it('should create a new category successfully', async () => {
      const dto = { description: 'New Category', active: true };
      const result = { id: 1, ...dto, created_at: 'date', updated_at: 'date' };
      
      jest.spyOn(service, 'create').mockResolvedValue(result);
      
      expect(await controller.create(dto)).toEqual(result);
    });

    it('should throw an error for duplicate category', async () => {
      jest.spyOn(service, 'create').mockImplementation(() => {
        throw new Error('Category already exists');
      });

      await expect(controller.create({ description: 'Existing Category', active: true }))
        .rejects.toThrow('Category already exists');
    });
  });

  // Adicionar testes para tooos os endpoints: findAll, findById, update, remove e activate
});
```
