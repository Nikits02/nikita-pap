# Mapa do Projeto

Este ficheiro serve para perceber rapidamente o que cada parte do projeto faz e para te ajudar a explicar o trabalho sem te perderes.

## 1. Como Pensar o Projeto

O projeto tem 3 blocos principais:

1. Interface
   Tudo o que o utilizador vê no browser.

2. Lógica de comunicação
   Funções que fazem pedidos ao backend.

3. Backend + base de dados
   Parte que valida, guarda, altera e devolve dados.

Se pensares sempre nestes 3 blocos, o projeto fica muito mais fácil de explicar.

## 2. Ordem Certa Para Ler o Projeto

Se estiveres perdido, segue sempre esta ordem:

1. [src/App.jsx](../src/App.jsx)
   Mostra todas as rotas.

2. [src/pages](../src/pages)
   As páginas estão separadas por área: públicas, autenticação e admin.

3. [src/components](../src/components)
   Componentes reutilizados dentro das páginas.

4. [src/services](../src/services)
   Faz a ponte entre frontend e backend.

5. [server/routes](../server/routes)
   Mostra os endpoints separados por área.

6. [server/index.js](../server/index.js)
   Mostra o arranque do servidor e a ligação das rotas.

7. [server/db.js](../server/db.js)
   Ligação ao MySQL.

## 3. O Que Esta Em Cada Pasta

### `src/pages`

Aqui estão as páginas principais, separadas por contexto.

Subpastas:
- `public/` -> páginas abertas do site
- `auth/` -> login, registo e área de conta
- `admin/` -> painel de administração

Exemplos:
- `public/Home.jsx` -> página inicial
- `public/Catalogo.jsx` -> lista de viaturas
- `public/VeiculoDetalhe.jsx` -> detalhe de uma viatura
- `public/Contacto.jsx` -> formulário de contacto
- `public/Retoma.jsx` -> formulário de retoma
- `public/TestDrive.jsx` -> pedido de test drive
- `public/Sobre.jsx` -> página institucional
- `auth/Login.jsx` -> login
- `auth/Registo.jsx` -> registo
- `auth/Conta.jsx` -> área privada do utilizador
- `admin/AdminVehicles.jsx` -> painel admin de viaturas
- `admin/AdminTradeIns.jsx` -> painel admin de retomas
- `admin/AdminUsers.jsx` -> painel admin de utilizadores

### `src/components`

Componentes reutilizáveis.

Subpastas importantes:
- `admin/` -> layout do painel admin
- `form/` -> campos e selects reutilizáveis
- `icons/` -> ícones SVG
- `blog/` -> componentes da área de blog
- `vehicle/` -> componentes do detalhe de viatura
- `test-drive/` -> componentes específicos do test drive

### `src/data`

Conteúdo estático ou configurações simples.

Exemplos:
- `navigation.js` -> links da navbar/footer
- `about.js` -> conteúdo da página Sobre
- `footer.js` -> dados do footer
- `contact.js` -> opções da página Contacto
- `tradeIn.js` -> opções e passos da página Retoma
- `adminVehicleFields.js` -> campos do formulário admin

### `src/hooks`

Hooks reutilizáveis.

Os mais importantes:
- `useVehicles.js` -> carrega viaturas do backend
- `useFormState.js` -> ajuda a gerir formulários
- `useDismissableLayer.js` -> fechar menus/dropdowns

### `src/services`

Aqui está a comunicação HTTP.

- `http.js` -> função base `requestJson`
- `api.js` -> pedidos normais do site
- `authApi.js` -> login/registo/sessão
- `adminApi.js` -> pedidos autenticados do admin

### `src/utils`

Funções auxiliares.

Exemplos:
- `vehicleMeta.js` -> enrich dos dados da viatura
- `vehicle.js` -> labels e texto único de viaturas
- `format.js` -> formatação de preco e outros
- `date.js` -> datas

### `server/lib`

Helpers do backend.

Exemplos:
- `vehiclePayload.js` -> normalização/validação do payload das viaturas
- `vehicleImageUpload.js` -> upload de imagens

### `server/middleware`

- `authenticateAdmin.js` -> protege rotas admin com JWT

### `server/routes`

Rotas Express separadas por responsabilidade.

- `public.js` -> viaturas, contacto, test drive, retoma e financiamento
- `auth.js` -> login, registo, logout e validação de sessão
- `admin.js` -> endpoints protegidos do painel de administração

## 4. Fluxo de Dados Mais Importante

Exemplo: Catálogo

1. O utilizador abre `/catalogo`
2. A página usa `useVehicles()`
3. `useVehicles()` chama `fetchVehicles()`
4. `fetchVehicles()` usa `requestJson("/api/vehicles")`
5. O backend responde com dados da tabela `vehicles`
6. O frontend transforma esses dados e mostra os cards

Este mesmo raciocinio aplica-se a retomas, contacto e admin.

## 5. Rotas do Frontend

Públicas:
- `/`
- `/catalogo`
- `/viaturas/:slug`
- `/contacto`
- `/financiamento`
- `/retoma`
- `/blog`
- `/test-drive`
- `/sobre`
- `/registo`
- `/login`
- `*` página 404 para rotas inexistentes

Protegidas:
- `/conta`
- `/admin/*`

## 6. Rotas do Backend

Públicas:
- `GET /api/health`
- `GET /api/vehicles`
- `POST /api/contact`
- `POST /api/test-drives`
- `POST /api/trade-ins`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/admin/login`

Admin:
- `GET /api/admin/vehicles`
- `GET /api/admin/vehicles/:id`
- `POST /api/admin/vehicles`
- `PUT /api/admin/vehicles/:id`
- `DELETE /api/admin/vehicles/:id`
- `POST /api/admin/uploads/vehicle-image`
- `GET /api/admin/trade-ins`
- `PATCH /api/admin/trade-ins/:id`
- `DELETE /api/admin/trade-ins/:id`
- `GET /api/admin/users`
- `DELETE /api/admin/users/:id`

## 7. Como Explicar o Projeto a Um Professor

Explicacao curta:

"No frontend usei React com componentes reutilizáveis, páginas separadas e hooks para carregar dados. No backend usei Express e MySQL para guardar viaturas, utilizadores e pedidos feitos pelos formulários. O admin usa autenticação por token e permite gerir o conteúdo do projeto."

Explicacao por camadas:

- Apresentacao:
  páginas, componentes, CSS

- Logica:
  hooks, utils, services

- Persistencia:
  backend, endpoints, MySQL

## 8. O Que Abrir Consoante a Pergunta

Se te perguntarem...

"Onde estão as páginas?"
- abre `src/pages`

"Onde são feitas as chamadas a API?"
- abre `src/services`

"Onde e feito o login?"
- abre `src/pages/auth/Login.jsx`, `src/pages/admin/AdminLogin.jsx`, `src/services/authApi.js`, `src/services/adminApi.js`

"Onde e protegido o admin?"
- abre `src/components/ProtectedAdminRoute.jsx` e `server/middleware/authenticateAdmin.js`

"Onde são guardadas as retomas?"
- abre `src/pages/public/Retoma.jsx`, `src/services/api.js` e `server/routes/public.js`

"Onde se gerem viaturas?"
- abre `src/pages/admin/AdminVehicles.jsx`, `src/pages/admin/AdminVehicleForm.jsx` e `server/routes/admin.js`

## 9. O Que Eu Mudaria Mais Tarde

Se um dia quiseres refatorar com calma, os proximos passos de organizacao seriam:

1. criar uma pasta `features/` com módulos por área
2. juntar CSS por feature
3. separar melhor a logica admin da logica publica
4. extrair componentes menores das páginas admin mais longas

Mas, para já, a forma mais segura de organizar e manter a estrutura atual simples, com páginas por área, services centralizados e rotas do backend separadas.
