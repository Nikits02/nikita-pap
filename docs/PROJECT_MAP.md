# Mapa do Projeto

Este ficheiro serve para perceber rapidamente o que cada parte do projeto faz e para te ajudar a explicar o trabalho sem te perderes.

## 1. Como Pensar o Projeto

O projeto tem 3 blocos principais:

1. Interface
   Tudo o que o utilizador vÃª no browser.

2. LÃ³gica de comunicaÃ§Ã£o
   FunÃ§Ãµes que fazem pedidos ao backend.

3. Backend + base de dados
   Parte que valida, guarda, altera e devolve dados.

Se pensares sempre nestes 3 blocos, o projeto fica muito mais fÃ¡cil de explicar.

## 2. Ordem Certa Para Ler o Projeto

Se estiveres perdido, segue sempre esta ordem:

1. [src/App.jsx](../src/App.jsx)
   Mostra todas as rotas.

2. [src/pages](../src/pages)
   As pÃ¡ginas estÃ£o separadas por Ã¡rea: pÃºblicas, autenticaÃ§Ã£o e admin.

3. [src/components](../src/components)
   Componentes reutilizados dentro das pÃ¡ginas.

4. [src/services](../src/services)
   Faz a ponte entre frontend e backend.

5. [server/routes](../server/routes)
   Mostra os endpoints separados por Ã¡rea.

6. [server/index.js](../server/index.js)
   Mostra o arranque do servidor e a ligaÃ§Ã£o das rotas.

7. [server/databaseConnection.js](../server/databaseConnection.js)
   LigaÃ§Ã£o ao MySQL.

## 3. O Que Esta Em Cada Pasta

### `src/pages`

Aqui estÃ£o as pÃ¡ginas principais, separadas por contexto.

Subpastas:
- `public/` -> pÃ¡ginas abertas do site
- `auth/` -> login, registo e Ã¡rea de conta
- `admin/` -> painel de administraÃ§Ã£o

Exemplos:
- `public/Home.jsx` -> pÃ¡gina inicial
- `public/Catalogo.jsx` -> lista de viaturas
- `public/VeiculoDetalhe.jsx` -> detalhe de uma viatura
- `public/Contacto.jsx` -> formulÃ¡rio de contacto
- `public/Retoma.jsx` -> formulÃ¡rio de retoma
- `public/TestDrive.jsx` -> pedido de test drive
- `public/Sobre.jsx` -> pÃ¡gina institucional
- `auth/Login.jsx` -> login
- `auth/Registo.jsx` -> registo
- `auth/Conta.jsx` -> Ã¡rea privada do utilizador
- `admin/AdminVehicles.jsx` -> painel admin de viaturas
- `admin/AdminTradeIns.jsx` -> painel admin de retomas
- `admin/AdminUsers.jsx` -> painel admin de utilizadores

### `src/components`

Componentes reutilizÃ¡veis.

Subpastas importantes:
- `admin/` -> layout do painel admin
- `form/` -> campos e selects reutilizÃ¡veis
- `icons/` -> Ã­cones SVG
- `blog/` -> componentes da Ã¡rea de blog
- `vehicle/` -> componentes do detalhe de viatura
- `test-drive/` -> componentes especÃ­ficos do test drive

### `src/data`

ConteÃºdo estÃ¡tico ou configuraÃ§Ãµes simples.

Exemplos:
- `navigation.js` -> links da navbar/footer
- `about.js` -> conteÃºdo da pÃ¡gina Sobre
- `footer.js` -> dados do footer
- `contact.js` -> opÃ§Ãµes da pÃ¡gina Contacto
- `tradeIn.js` -> opÃ§Ãµes e passos da pÃ¡gina Retoma
- `adminVehicleFields.js` -> campos do formulÃ¡rio admin

### `src/hooks`

Hooks reutilizÃ¡veis.

Os mais importantes:
- `useVehicles.js` -> carrega viaturas do backend
- `useFormState.js` -> ajuda a gerir formulÃ¡rios
- `useDismissableLayer.js` -> fechar menus/dropdowns

### `src/services`

Aqui estÃ¡ a comunicaÃ§Ã£o HTTP.

- `http.js` -> funÃ§Ã£o base `requestJson`
- `api.js` -> pedidos normais do site
- `authApi.js` -> login/registo/sessÃ£o
- `adminApi.js` -> pedidos autenticados do admin

### `src/utils`

FunÃ§Ãµes auxiliares.

Exemplos:
- `vehicleMeta.js` -> enrich dos dados da viatura
- `vehicle.js` -> labels e texto Ãºnico de viaturas
- `format.js` -> formataÃ§Ã£o de preco e outros
- `date.js` -> datas

### `server/lib`

Helpers do backend.

Exemplos:
- `vehicleFormPayload.js` -> normalizaÃ§Ã£o/validaÃ§Ã£o do payload das viaturas
- `vehicleImageUploadHandler.js` -> upload de imagens

### `server/middleware`

- `requireAdminLogin.js` -> protege rotas admin com JWT

### `server/routes`

Rotas Express separadas por responsabilidade.

- `public.js` -> viaturas, contacto, test drive, retoma e financiamento
- `auth.js` -> login, registo, logout e validaÃ§Ã£o de sessÃ£o
- `admin.js` -> endpoints protegidos do painel de administraÃ§Ã£o

## 4. Fluxo de Dados Mais Importante

Exemplo: CatÃ¡logo

1. O utilizador abre `/catalogo`
2. A pÃ¡gina usa `useVehicles()`
3. `useVehicles()` chama `fetchVehicles()`
4. `fetchVehicles()` usa `requestJson("/api/vehicles")`
5. O backend responde com dados da tabela `vehicles`
6. O frontend transforma esses dados e mostra os cards

Este mesmo raciocinio aplica-se a retomas, contacto e admin.

## 5. Rotas do Frontend

PÃºblicas:
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
- `*` pÃ¡gina 404 para rotas inexistentes

Protegidas:
- `/conta`
- `/admin/*`

## 6. Rotas do Backend

PÃºblicas:
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

"No frontend usei React com componentes reutilizÃ¡veis, pÃ¡ginas separadas e hooks para carregar dados. No backend usei Express e MySQL para guardar viaturas, utilizadores e pedidos feitos pelos formulÃ¡rios. O admin usa autenticaÃ§Ã£o por token e permite gerir o conteÃºdo do projeto."

Explicacao por camadas:

- Apresentacao:
  pÃ¡ginas, componentes, CSS

- Logica:
  hooks, utils, services

- Persistencia:
  backend, endpoints, MySQL

## 8. O Que Abrir Consoante a Pergunta

Se te perguntarem...

"Onde estÃ£o as pÃ¡ginas?"
- abre `src/pages`

"Onde sÃ£o feitas as chamadas a API?"
- abre `src/services`

"Onde e feito o login?"
- abre `src/pages/auth/Login.jsx`, `src/pages/admin/AdminLogin.jsx`, `src/services/authApi.js`, `src/services/adminApi.js`

"Onde e protegido o admin?"
- abre `src/components/ProtectedAdminRoute.jsx` e `server/middleware/requireAdminLogin.js`

"Onde sÃ£o guardadas as retomas?"
- abre `src/pages/public/Retoma.jsx`, `src/services/api.js` e `server/routes/publicRoutes.js`

"Onde se gerem viaturas?"
- abre `src/pages/admin/AdminVehicles.jsx`, `src/pages/admin/AdminVehicleForm.jsx` e `server/routes/adminRoutes.js`

## 9. O Que Eu Mudaria Mais Tarde

Se um dia quiseres refatorar com calma, os proximos passos de organizacao seriam:

1. criar uma pasta `features/` com mÃ³dulos por Ã¡rea
2. juntar CSS por feature
3. separar melhor a logica admin da logica publica
4. extrair componentes menores das pÃ¡ginas admin mais longas

Mas, para jÃ¡, a forma mais segura de organizar e manter a estrutura atual simples, com pÃ¡ginas por Ã¡rea, services centralizados e rotas do backend separadas.
