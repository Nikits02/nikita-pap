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

Frontend:
- `http://localhost:5173`

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
  pages/        paginas principais da aplicacao
  services/     chamadas HTTP para a API
  styles/       tokens base de design
  utils/        funcoes auxiliares

server/
  index.js      servidor Express e endpoints
  db.js         ligacao a base de dados
  lib/          logica auxiliar do backend
  middleware/   middleware de autenticacao
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

4. [server/index.js](server/index.js)
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
- a pagina [src/pages/VeiculoDetalhe.jsx](src/pages/VeiculoDetalhe.jsx) encontra a viatura correta e mostra os detalhes

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
- os dados da sessao ficam guardados no browser

### 7. Painel admin

- login admin: `POST /api/admin/login`
- rotas protegidas por JWT
- o token admin fica guardado e e usado em [src/services/adminApi.js](src/services/adminApi.js)

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

Por area/pagina:
- `base.css`
- `catalog.css`
- `contact.css`
- `tradein.css`
- `vehicle-detail.css`
- `admin.css`
- `auth.css`
- `blog.css`
- `footer.css`
- `test-drive.css`
- `finance.css`

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
