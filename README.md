# NikitaMotors

Projeto PAP desenvolvido com React + Vite no frontend e Node.js + Express + MySQL no backend.

O objetivo do projeto e apresentar um stand automovel premium com:
- catalogo de viaturas
- pagina de detalhe por viatura
- pedidos de contacto
- pedidos de test drive
- pedidos de retoma
- autenticacao de utilizadores
- painel de administracao para gerir viaturas, retomas e utilizadores

## Stack

Frontend:
- React
- React Router
- Vite
- CSS dividido por areas/paginas

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

Variaveis de ambiente minimas no backend:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

Opcional:
- `PORT`
- `CORS_ORIGIN`
  Pode receber uma ou varias origens separadas por virgulas, por exemplo:
  `http://localhost:5174,http://127.0.0.1:5174`

Frontend:
- `http://localhost:5174`

Backend:
- `http://localhost:3002`

Nota:
- o frontend usa proxy no `vite.config.js` para encaminhar `/api` e `/uploads` para o backend

## Estrutura Geral

```text
src/
  components/   componentes reutilizaveis
  data/         dados estaticos e configuracoes simples
  hooks/        hooks reutilizaveis
  pages/        paginas organizadas por area
    admin/      paginas do painel de administracao
    auth/       login, registo e conta
    public/     paginas publicas do site
  services/     chamadas HTTP para a API
  styles/       tokens, estilos globais e estilos por pagina
    app/        estilos globais da interface
    pages/      estilos especificos de areas/paginas
  utils/        funcoes auxiliares

server/
  index.js      arranque do servidor Express
  db.js         ligacao a base de dados
  lib/          logica auxiliar do backend
  middleware/   middleware de autenticacao
  routes/       endpoints publicos, autenticacao e admin
  uploads/      imagens carregadas
```

## Ficheiros Mais Importantes

Se quiseres perceber o projeto depressa, abre por esta ordem:

1. [src/App.jsx](src/App.jsx)
   Aqui estao todas as rotas do site e do admin.

2. [src/pages](src/pages)
   Cada ficheiro corresponde a uma pagina.

3. [src/services](src/services)
   Aqui ves como o frontend comunica com o backend.

4. [server/routes](server/routes)
   Aqui estao os endpoints, validacoes principais e operacoes na base de dados.

5. [src/components](src/components)
   Componentes reutilizaveis usados pelas paginas.

## Paginas do Frontend

Publicas:
- `/` Home
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
- `*` pagina 404 para rotas inexistentes

Privadas:
- `/conta`

Admin:
- `/admin/login`
- `/admin/viaturas`
- `/admin/viaturas/nova`
- `/admin/viaturas/:id/editar`
- `/admin/retomas`
- `/admin/utilizadores`

## Fluxos Principais

### 1. Catalogo de viaturas

- o frontend chama `fetchVehicles()` em [src/services/api.js](src/services/api.js)
- essa chamada vai para `GET /api/vehicles`
- o backend responde com as viaturas da base de dados
- no frontend, o hook [src/hooks/useVehicles.js](src/hooks/useVehicles.js) normaliza os dados e acrescenta meta-informacao

### 2. Detalhe da viatura

- a rota usa o `slug`
- o hook `useVehicles()` carrega as viaturas
- a pagina [src/pages/public/VeiculoDetalhe.jsx](src/pages/public/VeiculoDetalhe.jsx) encontra a viatura correta e mostra os detalhes

### 3. Formulario de contacto

- frontend envia para `POST /api/contact`
- backend guarda em `contact_messages`

### 4. Formulario de test drive

- frontend envia para `POST /api/test-drives`
- backend guarda em `test_drives`

### 5. Formulario de retoma

- frontend envia para `POST /api/trade-ins`
- backend guarda em `trade_in_requests`

### 6. Login e registo

- registo: `POST /api/auth/register`
- login: `POST /api/auth/login`
- o backend cria uma sessao autenticada por cookie `HttpOnly`
- o frontend guarda localmente apenas os dados do utilizador para a interface

### 7. Painel admin

- login admin: `POST /api/admin/login`
- rotas protegidas por JWT
- as rotas admin funcionam por sessao autenticada via cookie

## Base de Dados

Tabelas principais usadas no projeto:
- `admins`
- `users`
- `vehicles`
- `test_drives`
- `contact_messages`
- `trade_in_requests`

## Estilos

Os estilos estao divididos em dois niveis:

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

Por pagina/area:
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

Tudo e importado a partir de [src/index.css](src/index.css).

## Como Explicar o Projeto

Resumo simples:

"O projeto esta dividido em duas partes: frontend em React e backend em Express. O frontend trata da interface, paginas, componentes e formularios. O backend trata da autenticacao, CRUD de viaturas, gestao de retomas, utilizadores e ligacao a base de dados MySQL. A comunicacao entre ambos e feita por API REST."

Se quiseres uma explicacao mais detalhada da arquitetura, abre:
- [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md)

## Documentacao Disponivel

- [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md)
  Mapa geral do projeto: pastas, ficheiros importantes, rotas e forma certa de ler o codigo.

- [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
  Lista dos endpoints do backend, o que recebem e o que devolvem.

- [docs/DATABASE.md](docs/DATABASE.md)
  Explicacao simples das tabelas principais da base de dados e da sua funcao no projeto.

- [docs/PRESENTATION_GUIDE.md](docs/PRESENTATION_GUIDE.md)
  Guia de apresentacao oral para explicares o projeto com seguranca.

## Comandos Uteis

Frontend:
```powershell
npm run dev
npm run build
```

Backend:
```powershell
cd server
npm run dev
```

## Estado Atual do Projeto

Ja implementado:
- catalogo dinamico
- detalhe de viaturas
- retoma funcional
- contacto funcional
- test drive funcional
- login/registo
- admin de viaturas
- admin de retomas
- admin de utilizadores

## Sugestao de Proximos Passos

- filtros no admin para retomas vistas/por ver
- area admin para mensagens de contacto
- revisao final de UX e mobile
- documentacao final para apresentacao PAP
