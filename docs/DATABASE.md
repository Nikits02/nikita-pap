# Base de Dados

Este ficheiro explica a base de dados do projeto de forma simples.

Base de dados usada:
- `nikita_stand`

Ligacao configurada em:
- [server/db.js](../server/db.js)

## 1. Ideia Geral

A base de dados guarda 3 tipos principais de informacao:

1. Contas
   Utilizadores normais e administradores.

2. Conteudo principal do site
   Viaturas.

3. Pedidos feitos por formularios
   Contactos, test drives e retomas.

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
- a password nao fica guardada em texto simples
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
- guardar as viaturas mostradas no catalogo e no admin

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
- esta e a tabela central do catalogo
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
- guardar mensagens enviadas no formulario de contacto

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

## 3. Onde as Tabelas Sao Criadas

No projeto, varias tabelas sao criadas automaticamente no arranque do backend.

Isto acontece em:
- [server/lib/bootstrap.js](../server/lib/bootstrap.js)

Funcoes principais:
- `ensureAuthTables()`
- `ensureLeadTables()`

Isto significa que o servidor:
- cria tabelas em falta
- adiciona a coluna `is_viewed` nas retomas, se ainda nao existir

## 4. Relacao Entre Tabelas e Funcionalidades

### Catalogo

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

### Painel Admin

- viaturas:
  tabela `vehicles`

- retomas:
  tabela `trade_in_requests`

- utilizadores:
  tabela `users`

## 5. Como Explicar a Base de Dados

Forma simples:

"A base de dados foi organizada para separar conteudo do site e pedidos dos utilizadores. A tabela `vehicles` guarda as viaturas do catalogo. As tabelas `users` e `admins` tratam da autenticacao. As tabelas `contact_messages`, `test_drives` e `trade_in_requests` guardam os dados enviados pelos formularios."

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
