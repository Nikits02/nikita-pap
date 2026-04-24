# Roteiro da Demo PAP

Este roteiro é para a parte prática da apresentação. A ideia é mostrares o projeto como se fosses apresentar um produto real, sem saltar de página em página ao acaso.

## Objetivo da Demo

Mostrar que a NikitaMotors é uma aplicação full stack completa:

- tem uma área pública para clientes;
- tem autenticação;
- guarda pedidos na base de dados;
- tem painel admin para gerir informação;
- tem validações e organização técnica.

## Antes de Começar

Confirma isto antes da apresentação:

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

URLs úteis:

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

"Esta é a página inicial da NikitaMotors. O objetivo foi criar a presença digital de um stand automóvel premium, com uma interface forte, navegação simples e acesso rápido às principais funcionalidades."

O que mostrar:

- imagem hero;
- navbar;
- marca NikitaMotors;
- secções principais da homepage.

Tempo: 45 segundos.

### 2. Catálogo

Vai a `/catalogo`.

O que dizer:

"Aqui as viaturas são carregadas a partir do backend. O frontend recebe os dados, transforma-os e apresenta-os em cards com filtros e informação resumida."

O que mostrar:

- lista de viaturas;
- filtros/pesquisa, se estiverem visíveis;
- uma viatura premium com imagem boa.

Frase técnica curta:

"Esta página usa o hook `useVehicles`, que chama o service `fetchVehicles`, e esse service faz o pedido `GET /api/vehicles`."

Tempo: 1 minuto.

### 3. Detalhe da Viatura

Abre uma viatura do catálogo.

O que dizer:

"Cada viatura tem uma página própria com imagem, preço, características e ações para continuar o contacto com o stand."

O que mostrar:

- imagem;
- preço;
- características;
- botões/links para contacto, financiamento ou test drive.

Tempo: 1 minuto.

### 4. Login e Área Privada

Tenta abrir uma funcionalidade protegida, como `/test-drive` ou `/financiamento`.

O que dizer:

"Algumas ações estão protegidas. Se o utilizador não tiver sessão iniciada, é redirecionado para o login."

Depois faz login com uma conta normal preparada.

O que mostrar:

- redirecionamento para login;
- login;
- acesso à funcionalidade depois da autenticação.

Frase técnica curta:

"A sessão é validada no backend e o frontend usa contexto de autenticação para saber se o utilizador pode aceder."

Tempo: 1 minuto.

### 5. Pedido de Test Drive

Vai a `/test-drive`.

O que dizer:

"O cliente pode escolher a viatura, a data e a hora pretendida. O backend valida os dados antes de guardar o pedido na base de dados."

O que mostrar:

- seleção da viatura;
- campos pessoais;
- data/hora;
- submissão do formulário.

Se não quiseres criar muitos pedidos durante a apresentação, podes dizer:

"Para não duplicar dados na demo, vou apenas mostrar os campos e explicar que ao submeter este formulário é criado um registo na tabela `test_drives`."

Tempo: 1 minuto.

### 6. Financiamento ou Retoma

Escolhe uma das duas, não precisas mostrar tudo ao detalhe.

Financiamento:

"Nesta página existe uma simulação de financiamento. O utilizador escolhe valores e pode enviar o pedido para contacto posterior."

Retoma:

"Nesta página o cliente envia os dados da sua viatura atual para pedir uma avaliação de retoma."

O que mostrar:

- formulário;
- validações;
- mensagem de sucesso ou fluxo esperado.

Tempo: 1 minuto.

### 7. Painel Admin

Vai a `/admin/login` e entra como admin.

O que dizer:

"O painel admin é separado da área pública e só pode ser acedido por utilizadores com permissões de administrador."

O que mostrar:

- login admin;
- página de viaturas;
- pedidos de test drive, retomas, contactos ou financiamentos;
- eliminar/marcar visto se fizer sentido.

Frase técnica curta:

"As rotas admin são protegidas no frontend por `ProtectedAdminRoute` e no backend por middleware de autenticação."

Tempo: 2 minutos.

### 8. Código

Abre o editor e mostra só 4 ficheiros. Não abras ficheiros ao acaso.

Ordem recomendada:

1. `src/App.jsx`
   Mostra as rotas e a separação entre públicas, autenticadas e admin.

2. `src/services/api.js`
   Mostra a ponte entre frontend e backend.

3. `server/routes/public.js`
   Mostra validações e endpoints públicos.

4. `server/routes/admin.js`
   Mostra endpoints protegidos do painel admin.

Se sobrar tempo:

- `server/db.js` para mostrar a ligação MySQL;
- `server/lib/bootstrap.js` para mostrar a criação/atualização das tabelas;
- `server/middleware/authenticateAdmin.js` para mostrar proteção admin.

Tempo: 2 minutos.

## Frase de Fecho

"Com este projeto consegui juntar frontend, backend, autenticação e base de dados num sistema funcional. A parte pública permite ao cliente consultar viaturas e enviar pedidos, enquanto o painel admin permite gerir esses dados. Foi uma forma prática de aplicar React, Express, MySQL, validações, sessões e organização de código num caso realista."

## Plano B

Se o backend falhar:

- mostra a interface;
- abre `docs/API_REFERENCE.md`;
- explica os endpoints;
- mostra `server/routes/public.js` e `server/routes/admin.js`.

Se a base de dados falhar:

- mostra `docs/DATABASE.md`;
- mostra `server/lib/bootstrap.js`;
- explica que as tabelas são criadas automaticamente no arranque.

Se o login falhar:

- mostra `server/scripts/createAdmin.js`;
- mostra `server/middleware/authenticateAdmin.js`;
- explica como a sessão é validada.

Se uma imagem falhar:

- continua a demo pelo catálogo/admin;
- explica que as imagens públicas ficam em `public/vehicles` e uploads ficam em `/uploads/vehicles`.

## Erros a Evitar

- Não criar funcionalidades novas na véspera.
- Não apagar dados durante a apresentação.
- Não mostrar passwords ou o conteúdo de `server/.env`.
- Não abrir demasiados ficheiros no editor.
- Não tentar explicar tudo; escolhe o caminho mais forte e segue o guião.
