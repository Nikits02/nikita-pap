# NikitaMotors

Projeto PAP desenvolvido com React + Vite no frontend e Node.js + Express + MySQL no backend.

O objetivo do projeto Ã© apresentar um stand automÃ³vel premium com:
- catÃ¡logo de viaturas
- pÃ¡gina de detalhe por viatura
- pedidos de contacto
- pedidos de test drive
- pedidos de retoma
- pedidos de financiamento
- autenticaÃ§Ã£o de utilizadores
- painel de administraÃ§Ã£o para gerir viaturas, pedidos e utilizadores

## Stack

Frontend:
- React
- React Router
- Vite
- CSS dividido por Ã¡reas/pÃ¡ginas

Backend:
- Node.js
- Express
- MySQL
- JWT
- bcryptjs

## Como arrancar o projeto

Frontend:
```powershell
npm install
npm run dev
```

Backend:
```powershell
cd server
npm install
npm run dev
```

Antes de arrancar o backend pela primeira vez:
- cria a base de dados MySQL `nikita_stand`
- cria `server/.env` com base em [server/.env.example](server/.env.example)
- cria a conta admin com:

```powershell
cd server
npm run create-admin -- admin Admin123
```

VariÃ¡veis de ambiente mÃ­nimas no backend:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

Opcional:
- `PORT`
- `CORS_ORIGIN`
  Pode receber uma ou vÃ¡rias origens separadas por vÃ­rgulas, por exemplo:
  `http://localhost:5174,http://127.0.0.1:5174`

Frontend:
- `http://localhost:5174`

Backend:
- `http://localhost:3002`

Nota:
- o frontend usa proxy no `vite.config.js` para encaminhar `/api` e `/uploads` para o backend
- o backend cria automaticamente as tabelas principais no arranque, incluindo a tabela `vehicles`
- guia completo de preparaÃ§Ã£o: [docs/PRESENTATION_SETUP.md](docs/PRESENTATION_SETUP.md)

## Estrutura Geral

```text
src/
  components/   componentes reutilizÃ¡veis
  data/         dados estÃ¡ticos e configuraÃ§Ãµes simples
  hooks/        hooks reutilizÃ¡veis
  pages/        pÃ¡ginas organizadas por Ã¡rea
    admin/      pÃ¡ginas do painel de administraÃ§Ã£o
    auth/       login, registo e conta
    public/     pÃ¡ginas pÃºblicas do site
  services/     chamadas HTTP para a API
  styles/       tokens, estilos globais e estilos por pÃ¡gina
    app/        estilos globais da interface
    pages/      estilos especÃ­ficos de Ã¡reas/pÃ¡ginas
  utils/        funÃ§Ãµes auxiliares

server/
  index.js      arranque do servidor Express
  databaseConnection.js  ligacao a base de dados
  lib/          lÃ³gica auxiliar do backend
  middleware/   middleware de autenticaÃ§Ã£o
  routes/       endpoints pÃºblicos, autenticaÃ§Ã£o e admin
  uploads/      imagens carregadas
```

## Ficheiros Mais Importantes

Se quiseres perceber o projeto depressa, abre por esta ordem:

1. [src/App.jsx](src/App.jsx)
   Aqui estÃ£o todas as rotas do site e do admin.

2. [src/pages](src/pages)
   Cada ficheiro corresponde a uma pÃ¡gina.

3. [src/services](src/services)
   Aqui vÃªs como o frontend comunica com o backend.

4. [server/routes](server/routes)
   Aqui estÃ£o os endpoints, validaÃ§Ãµes principais e operaÃ§Ãµes na base de dados.

5. [src/components](src/components)
   Componentes reutilizÃ¡veis usados pelas pÃ¡ginas.

## PÃ¡ginas do Frontend

PÃºblicas:
- `/` Home
- `/catalogo`
- `/viaturas/:slug`
- `/contacto`
- `/blog`
- `/sobre`
- `/registo`
- `/login`
- `*` pÃ¡gina 404 para rotas inexistentes

Privadas:
- `/financiamento`
- `/retoma`
- `/test-drive`
- `/conta`

Admin:
- `/admin/login`
- `/admin/viaturas`
- `/admin/viaturas/nova`
- `/admin/viaturas/:id/editar`
- `/admin/retomas`
- `/admin/utilizadores`
- `/admin/contactos`
- `/admin/financiamentos`
- `/admin/test-drives`

## Fluxos Principais

### 1. CatÃ¡logo de viaturas

- o frontend chama `fetchVehicles()` em [src/services/api.js](src/services/api.js)
- essa chamada vai para `GET /api/vehicles`
- o backend responde com as viaturas da base de dados
- no frontend, o hook [src/hooks/useVehicles.js](src/hooks/useVehicles.js) normaliza os dados e acrescenta meta-informaÃ§Ã£o

### 2. Detalhe da viatura

- a rota usa o `slug`
- o hook `useVehicles()` carrega as viaturas
- a pÃ¡gina [src/pages/public/VeiculoDetalhe.jsx](src/pages/public/VeiculoDetalhe.jsx) encontra a viatura correta e mostra os detalhes

### 3. FormulÃ¡rio de contacto

- frontend envia para `POST /api/contact`
- backend guarda em `contact_messages`

### 4. FormulÃ¡rio de test drive

- a pÃ¡gina `/test-drive` exige sessÃ£o iniciada
- frontend envia para `POST /api/test-drives`
- backend guarda em `test_drives`

### 5. FormulÃ¡rio de retoma

- a pÃ¡gina `/retoma` exige sessÃ£o iniciada
- frontend envia para `POST /api/trade-ins`
- backend guarda em `trade_in_requests`

### 6. Simulador e pedido de financiamento

- a pÃ¡gina `/financiamento` exige sessÃ£o iniciada
- o utilizador simula valores de financiamento e envia o pedido
- frontend envia para `POST /api/finance-requests`
- backend guarda em `finance_requests`

### 7. Login e registo

- registo: `POST /api/auth/register`
- login: `POST /api/auth/login`
- o backend cria uma sessÃ£o autenticada por cookie `HttpOnly`
- o frontend guarda localmente apenas os dados do utilizador para a interface

### 8. Painel admin

- login admin: `POST /api/admin/login`
- rotas protegidas por JWT
- as rotas admin funcionam por sessÃ£o autenticada via cookie
- permite gerir viaturas, retomas, utilizadores, contactos, financiamentos e test drives

## Base de Dados

Tabelas principais usadas no projeto:
- `admins`
- `users`
- `vehicles`
- `test_drives`
- `contact_messages`
- `trade_in_requests`
- `finance_requests`

## Estilos

Os estilos estÃ£o divididos em dois nÃ­veis:

Base:
- [src/styles/colors.css](src/styles/colors.css)
- [src/styles/tokens.css](src/styles/tokens.css)
- [src/styles/typography.css](src/styles/typography.css)
- [src/styles/surfaces.css](src/styles/surfaces.css)
- [src/styles/layout.css](src/styles/layout.css)

App e blocos partilhados:
- [src/styles/app/base.css](src/styles/app/base.css)
- [src/styles/app/header.css](src/styles/app/header.css)
- [src/styles/app/luxury.css](src/styles/app/luxury.css)
- [src/styles/app/footer.css](src/styles/app/footer.css)

Por pÃ¡gina/Ã¡rea:
- [src/styles/pages/admin.css](src/styles/pages/admin.css)
- [src/styles/pages/about.css](src/styles/pages/about.css)
- [src/styles/pages/auth.css](src/styles/pages/auth.css)
- [src/styles/pages/blog.css](src/styles/pages/blog.css)
- [src/styles/pages/catalog.css](src/styles/pages/catalog.css)
- [src/styles/pages/contact.css](src/styles/pages/contact.css)
- [src/styles/pages/finance.css](src/styles/pages/finance.css)
- [src/styles/pages/home.css](src/styles/pages/home.css)
- [src/styles/pages/test-drive.css](src/styles/pages/test-drive.css)
- [src/styles/pages/tradein.css](src/styles/pages/tradein.css)
- [src/styles/pages/vehicle-detail.css](src/styles/pages/vehicle-detail.css)

Tudo Ã© importado a partir de [src/index.css](src/index.css).

## Como Explicar o Projeto

Resumo simples:

"O projeto estÃ¡ dividido em duas partes: frontend em React e backend em Express. O frontend trata da interface, pÃ¡ginas, componentes e formulÃ¡rios. O backend trata da autenticaÃ§Ã£o, CRUD de viaturas, gestÃ£o de retomas, utilizadores e ligacao a base de dados MySQL. A comunicaÃ§Ã£o entre ambos Ã© feita por API REST."

Se quiseres uma explicaÃ§Ã£o mais detalhada da arquitetura, abre:
- [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md)

## DocumentaÃ§Ã£o DisponÃ­vel

- [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md)
  Mapa geral do projeto: pastas, ficheiros importantes, rotas e forma certa de ler o cÃ³digo.

- [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
  Lista dos endpoints do backend, o que recebem e o que devolvem.

- [docs/DATABASE.md](docs/DATABASE.md)
  ExplicaÃ§Ã£o simples das tabelas principais da base de dados e da sua funÃ§Ã£o no projeto.

- [docs/PRESENTATION_GUIDE.md](docs/PRESENTATION_GUIDE.md)
  Guia de apresentaÃ§Ã£o oral para explicares o projeto com seguranÃ§a.

- [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md)
  Roteiro prÃ¡tico da demo: ordem de cliques, frases-chave, tempos e plano B.

- [docs/DEMO_VEHICLES.md](docs/DEMO_VEHICLES.md)
  Lista das viaturas estrela preparadas para causar melhor primeira impressÃ£o.

- [docs/PRESENTATION_SETUP.md](docs/PRESENTATION_SETUP.md)
  Checklist tÃ©cnica para preparar MySQL, variÃ¡veis de ambiente, admin e arranque da demo.

## Comandos Ãšteis

Frontend:
```powershell
npm run dev
npm run build
```

Backend:
```powershell
cd server
npm run dev
npm run create-admin -- admin Admin123
```

## Estado Atual do Projeto

JÃ¡ implementado:
- catÃ¡logo dinÃ¢mico
- detalhe de viaturas
- retoma funcional
- contacto funcional
- test drive funcional
- simulador e pedidos de financiamento
- login/registo
- admin de viaturas
- admin de retomas
- admin de utilizadores
- admin de contactos
- admin de financiamentos
- admin de test drives
- upload de imagens de viaturas no admin
- rotas protegidas para financiamento, retoma, test drive e Ã¡rea de conta

## SugestÃ£o de PrÃ³ximos Passos

- revisÃ£o final de UX e mobile
- reforcar testes dos endpoints principais
- rever textos, acentos e consistÃªncia visual
- preparar base de dados e credenciais para a apresentaÃ§Ã£o
