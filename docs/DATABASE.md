# Base de Dados

Este ficheiro explica a base de dados do projeto de forma simples.

Base de dados usada:
- `nikita_stand`

Ligação configurada em:
- [server/db.js](../server/db.js)

## 1. Ideia Geral

A base de dados guarda 3 tipos principais de informação:

1. Contas
   Utilizadores normais e administradores.

2. Conteúdo principal do site
   Viaturas.

3. Pedidos feitos por formulários
   Contactos, test drives, retomas e financiamentos.

## 2. Tabelas Principais

### `admins`

Serve para:
- guardar contas administradoras

Campos principais:
- `id`
- `username`
- `password_hash`
- `created_at`

Notas:
- a password não fica guardada em texto simples
- usa bcrypt

### `users`

Serve para:
- guardar contas normais criadas no site

Campos principais:
- `id`
- `nome`
- `username`
- `email`
- `password_hash`
- `created_at`

### `vehicles`

Serve para:
- guardar as viaturas mostradas no catálogo e no admin

Campos usados no projeto:
- `id`
- `source`
- `marca`
- `modelo`
- `tipo`
- `versao`
- `preco`
- `ano`
- `potencia`
- `quilometragem`
- `combustivel`
- `caixa`
- `imagem`
- `inserted_at`
- `novidade`

Notas:
- esta é a tabela central do catálogo
- o frontend transforma estes dados com `vehicleMeta.js`

### `test_drives`

Serve para:
- guardar pedidos de test drive

Campos principais:
- `id`
- `vehicle_slug`
- `data_preferida`
- `hora_preferida`
- `nome`
- `telefone`
- `email`
- `created_at`

### `contact_messages`

Serve para:
- guardar mensagens enviadas no formulário de contacto

Campos principais:
- `id`
- `nome`
- `email`
- `telefone`
- `assunto`
- `mensagem`
- `created_at`

### `trade_in_requests`

Serve para:
- guardar pedidos de retoma

Campos principais:
- `id`
- `marca`
- `modelo`
- `ano`
- `quilometragem`
- `estado_geral`
- `nome`
- `telefone`
- `email`
- `observacoes`
- `is_viewed`
- `created_at`

Notas:
- `is_viewed` permite marcar pedidos como vistos ou por ver no admin

## 3. Onde as Tabelas São Criadas

No projeto, várias tabelas são criadas automaticamente no arranque do backend.

Isto acontece em:
- [server/lib/bootstrap.js](../server/lib/bootstrap.js)

Funções principais:
- `ensureAuthTables()`
- `ensureCatalogTables()`
- `ensureLeadTables()`

Isto significa que o servidor:
- cria tabelas em falta
- prepara a tabela `vehicles` usada pelo catálogo
- adiciona a coluna `is_viewed` nas retomas, se ainda não existir

## 4. Relacao Entre Tabelas e Funcionalidades

### Catálogo

- tabela: `vehicles`
- frontend:
  `useVehicles()` -> `fetchVehicles()` -> `GET /api/vehicles`

### Registo e Login

- tabelas: `users` e `admins`
- frontend:
  `authApi.js` e `adminApi.js`

### Contacto

- tabela: `contact_messages`
- frontend:
  `src/pages/public/Contacto.jsx` -> `createContactMessage()`

### Test Drive

- tabela: `test_drives`
- frontend:
  `src/pages/public/TestDrive.jsx` -> `createTestDrive()`

### Retoma

- tabela: `trade_in_requests`
- frontend:
  `src/pages/public/Retoma.jsx` -> `createTradeInRequest()`

### Financiamento

- tabela: `finance_requests`
- frontend:
  `src/pages/public/Financiamento.jsx` -> `createFinanceRequest()`

### Painel Admin

- viaturas:
  tabela `vehicles`

- retomas:
  tabela `trade_in_requests`

- contactos:
  tabela `contact_messages`

- financiamentos:
  tabela `finance_requests`

- test drives:
  tabela `test_drives`

- utilizadores:
  tabela `users`

## 5. Como Explicar a Base de Dados

Forma simples:

"A base de dados foi organizada para separar conteúdo do site e pedidos dos utilizadores. A tabela `vehicles` guarda as viaturas do catálogo. As tabelas `users` e `admins` tratam da autenticação. As tabelas `contact_messages`, `test_drives`, `trade_in_requests` e `finance_requests` guardam os dados enviados pelos formulários."

## 6. Como Ver os Dados no MySQL

Exemplos uteis:

Ver utilizadores:
```sql
SELECT id, nome, username, email, created_at FROM users ORDER BY id DESC;
```

Ver admins:
```sql
SELECT id, username, created_at FROM admins ORDER BY id DESC;
```

Ver viaturas:
```sql
SELECT id, marca, modelo, versao, preco, ano FROM vehicles ORDER BY id DESC;
```

Ver retomas:
```sql
SELECT id, marca, modelo, nome, email, is_viewed, created_at
FROM trade_in_requests
ORDER BY id DESC;
```

Ver mensagens:
```sql
SELECT id, nome, email, assunto, created_at
FROM contact_messages
ORDER BY id DESC;
```

Ver test drives:
```sql
SELECT id, vehicle_slug, nome, email, data_preferida, hora_preferida
FROM test_drives
ORDER BY id DESC;
```

Ver financiamentos:
```sql
SELECT id, nome, email, telefone, viatura, prestácao_mensal, created_at
FROM finance_requests
ORDER BY id DESC;
```
