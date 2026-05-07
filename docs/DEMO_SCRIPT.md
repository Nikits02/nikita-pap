# Roteiro da Demo PAP

Este roteiro Ã© para a parte prÃ¡tica da apresentaÃ§Ã£o. A ideia Ã© mostrares o projeto como se fosses apresentar um produto real, sem saltar de pÃ¡gina em pÃ¡gina ao acaso.

## Objetivo da Demo

Mostrar que a NikitaMotors Ã© uma aplicaÃ§Ã£o full stack completa:

- tem uma Ã¡rea pÃºblica para clientes;
- tem autenticaÃ§Ã£o;
- guarda pedidos na base de dados;
- tem painel admin para gerir informaÃ§Ã£o;
- tem validaÃ§Ãµes e organizaÃ§Ã£o tÃ©cnica.

## Antes de ComeÃ§ar

Confirma isto antes da apresentaÃ§Ã£o:

```powershell
npm run lint
npm run build
npm run test:server
```

Arranque:

```powershell
cd server
npm run dev
```

Noutro terminal:

```powershell
npm run dev
```

URLs Ãºteis:

- Site: `http://localhost:5174`
- API health: `http://localhost:3002/api/health`
- Admin: `http://localhost:5174/admin/login`

## Percurso Principal

Viaturas recomendadas para a demo:

- Lamborghini Aventador SVJ;
- Aston Martin DBX707;
- Ferrari Roma;
- Mercedes-AMG SL 63.

Mais detalhes em [docs/DEMO_VEHICLES.md](DEMO_VEHICLES.md).

### 1. Home

Abre `/`.

O que dizer:

"Esta Ã© a pÃ¡gina inicial da NikitaMotors. O objetivo foi criar a presenÃ§a digital de um stand automÃ³vel premium, com uma interface forte, navegaÃ§Ã£o simples e acesso rÃ¡pido Ã s principais funcionalidades."

O que mostrar:

- imagem hero;
- navbar;
- marca NikitaMotors;
- secÃ§Ãµes principais da homepage.

Tempo: 45 segundos.

### 2. CatÃ¡logo

Vai a `/catalogo`.

O que dizer:

"Aqui as viaturas sÃ£o carregadas a partir do backend. O frontend recebe os dados, transforma-os e apresenta-os em cards com filtros e informaÃ§Ã£o resumida."

O que mostrar:

- lista de viaturas;
- filtros/pesquisa, se estiverem visÃ­veis;
- uma viatura premium com imagem boa.

Frase tÃ©cnica curta:

"Esta pÃ¡gina usa o hook `useVehicles`, que chama o service `fetchVehicles`, e esse service faz o pedido `GET /api/vehicles`."

Tempo: 1 minuto.

### 3. Detalhe da Viatura

Abre uma viatura do catÃ¡logo.

O que dizer:

"Cada viatura tem uma pÃ¡gina prÃ³pria com imagem, preÃ§o, caracterÃ­sticas e aÃ§Ãµes para continuar o contacto com o stand."

O que mostrar:

- imagem;
- preÃ§o;
- caracterÃ­sticas;
- botÃµes/links para contacto, financiamento ou test drive.

Tempo: 1 minuto.

### 4. Login e Ãrea Privada

Tenta abrir uma funcionalidade protegida, como `/test-drive` ou `/financiamento`.

O que dizer:

"Algumas aÃ§Ãµes estÃ£o protegidas. Se o utilizador nÃ£o tiver sessÃ£o iniciada, Ã© redirecionado para o login."

Depois faz login com uma conta normal preparada.

O que mostrar:

- redirecionamento para login;
- login;
- acesso Ã  funcionalidade depois da autenticaÃ§Ã£o.

Frase tÃ©cnica curta:

"A sessÃ£o Ã© validada no backend e o frontend usa contexto de autenticaÃ§Ã£o para saber se o utilizador pode aceder."

Tempo: 1 minuto.

### 5. Pedido de Test Drive

Vai a `/test-drive`.

O que dizer:

"O cliente pode escolher a viatura, a data e a hora pretendida. O backend valida os dados antes de guardar o pedido na base de dados."

O que mostrar:

- seleÃ§Ã£o da viatura;
- campos pessoais;
- data/hora;
- submissÃ£o do formulÃ¡rio.

Se nÃ£o quiseres criar muitos pedidos durante a apresentaÃ§Ã£o, podes dizer:

"Para nÃ£o duplicar dados na demo, vou apenas mostrar os campos e explicar que ao submeter este formulÃ¡rio Ã© criado um registo na tabela `test_drives`."

Tempo: 1 minuto.

### 6. Financiamento ou Retoma

Escolhe uma das duas, nÃ£o precisas mostrar tudo ao detalhe.

Financiamento:

"Nesta pÃ¡gina existe uma simulaÃ§Ã£o de financiamento. O utilizador escolhe valores e pode enviar o pedido para contacto posterior."

Retoma:

"Nesta pÃ¡gina o cliente envia os dados da sua viatura atual para pedir uma avaliaÃ§Ã£o de retoma."

O que mostrar:

- formulÃ¡rio;
- validaÃ§Ãµes;
- mensagem de sucesso ou fluxo esperado.

Tempo: 1 minuto.

### 7. Painel Admin

Vai a `/admin/login` e entra como admin.

O que dizer:

"O painel admin Ã© separado da Ã¡rea pÃºblica e sÃ³ pode ser acedido por utilizadores com permissÃµes de administrador."

O que mostrar:

- login admin;
- pÃ¡gina de viaturas;
- pedidos de test drive, retomas, contactos ou financiamentos;
- eliminar/marcar visto se fizer sentido.

Frase tÃ©cnica curta:

"As rotas admin sÃ£o protegidas no frontend por `ProtectedAdminRoute` e no backend por middleware de autenticaÃ§Ã£o."

Tempo: 2 minutos.

### 8. CÃ³digo

Abre o editor e mostra sÃ³ 4 ficheiros. NÃ£o abras ficheiros ao acaso.

Ordem recomendada:

1. `src/App.jsx`
   Mostra as rotas e a separaÃ§Ã£o entre pÃºblicas, autenticadas e admin.

2. `src/services/api.js`
   Mostra a ponte entre frontend e backend.

3. `server/routes/publicRoutes.js`
   Mostra validaÃ§Ãµes e endpoints pÃºblicos.

4. `server/routes/adminRoutes.js`
   Mostra endpoints protegidos do painel admin.

Se sobrar tempo:

- `server/databaseConnection.js` para mostrar a ligaÃ§Ã£o MySQL;
- `server/lib/createDatabaseTables.js` para mostrar a criaÃ§Ã£o/atualizaÃ§Ã£o das tabelas;
- `server/middleware/requireAdminLogin.js` para mostrar proteÃ§Ã£o admin.

Tempo: 2 minutos.

## Frase de Fecho

"Com este projeto consegui juntar frontend, backend, autenticaÃ§Ã£o e base de dados num sistema funcional. A parte pÃºblica permite ao cliente consultar viaturas e enviar pedidos, enquanto o painel admin permite gerir esses dados. Foi uma forma prÃ¡tica de aplicar React, Express, MySQL, validaÃ§Ãµes, sessÃµes e organizaÃ§Ã£o de cÃ³digo num caso realista."

## Plano B

Se o backend falhar:

- mostra a interface;
- abre `docs/API_REFERENCE.md`;
- explica os endpoints;
- mostra `server/routes/publicRoutes.js` e `server/routes/adminRoutes.js`.

Se a base de dados falhar:

- mostra `docs/DATABASE.md`;
- mostra `server/lib/createDatabaseTables.js`;
- explica que as tabelas sÃ£o criadas automaticamente no arranque.

Se o login falhar:

- mostra `server/scripts/createAdminAccount.js`;
- mostra `server/middleware/requireAdminLogin.js`;
- explica como a sessÃ£o Ã© validada.

Se uma imagem falhar:

- continua a demo pelo catÃ¡logo/admin;
- explica que as imagens pÃºblicas ficam em `public/vehicles` e uploads ficam em `/uploads/vehicles`.

## Erros a Evitar

- NÃ£o criar funcionalidades novas na vÃ©spera.
- NÃ£o apagar dados durante a apresentaÃ§Ã£o.
- NÃ£o mostrar passwords ou o conteÃºdo de `server/.env`.
- NÃ£o abrir demasiados ficheiros no editor.
- NÃ£o tentar explicar tudo; escolhe o caminho mais forte e segue o guiÃ£o.
