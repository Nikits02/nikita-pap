# NikitaMotors

Projeto PAP desenvolvido com React + Vite no frontend e Node.js + Express + MySQL no backend.

O objetivo do projeto é apresentar um stand automóvel premium com:
- catálogo de viaturas
- página de detalhe por viatura
- pedidos de contacto
- pedidos de test drive
- pedidos de retoma
- pedidos de financiamento
- autenticação de utilizadores
- painel de administração para gerir viaturas, pedidos e utilizadores

## Stack

Frontend:
- React
- React Router
- Vite
- CSS dividido por áreas/páginas

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

Variáveis de ambiente mínimas no backend:
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

Opcional:
- `PORT`
- `CORS_ORIGIN`
  Pode receber uma ou várias origens separadas por vírgulas, por exemplo:
  `http://localhost:5174,http://127.0.0.1:5174`

Frontend:
- `http://localhost:5174`

Backend:
- `http://localhost:3002`

Nota:
- o frontend usa proxy no `vite.config.js` para encaminhar `/api` e `/uploads` para o backend
- o backend cria automaticamente as tabelas principais no arranque, incluindo a tabela `vehicles`
- guia completo de preparação: [docs/PRESENTATION_SETUP.md](docs/PRESENTATION_SETUP.md)

## Estrutura Geral

```text
src/
  components/   componentes reutilizáveis
  data/         dados estáticos e configurações simples
  hooks/        hooks reutilizáveis
  pages/        páginas organizadas por área
    admin/      páginas do painel de administração
    auth/       login, registo e conta
    public/     páginas públicas do site
  services/     chamadas HTTP para a API
  styles/       tokens, estilos globais e estilos por página
    app/        estilos globais da interface
    pages/      estilos específicos de áreas/páginas
  utils/        funções auxiliares

server/
  index.js      arranque do servidor Express
  db.js         ligação à base de dados
  lib/          lógica auxiliar do backend
  middleware/   middleware de autenticação
  routes/       endpoints públicos, autenticação e admin
  uploads/      imagens carregadas
```

## Ficheiros Mais Importantes

Se quiseres perceber o projeto depressa, abre por esta ordem:

1. [src/App.jsx](src/App.jsx)
   Aqui estão todas as rotas do site e do admin.

2. [src/pages](src/pages)
   Cada ficheiro corresponde a uma página.

3. [src/services](src/services)
   Aqui vês como o frontend comunica com o backend.

4. [server/routes](server/routes)
   Aqui estão os endpoints, validações principais e operações na base de dados.

5. [src/components](src/components)
   Componentes reutilizáveis usados pelas páginas.

## Páginas do Frontend

Públicas:
- `/` Home
- `/catalogo`
- `/viaturas/:slug`
- `/contacto`
- `/blog`
- `/sobre`
- `/registo`
- `/login`
- `*` página 404 para rotas inexistentes

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

### 1. Catálogo de viaturas

- o frontend chama `fetchVehicles()` em [src/services/api.js](src/services/api.js)
- essa chamada vai para `GET /api/vehicles`
- o backend responde com as viaturas da base de dados
- no frontend, o hook [src/hooks/useVehicles.js](src/hooks/useVehicles.js) normaliza os dados e acrescenta meta-informação

### 2. Detalhe da viatura

- a rota usa o `slug`
- o hook `useVehicles()` carrega as viaturas
- a página [src/pages/public/VeiculoDetalhe.jsx](src/pages/public/VeiculoDetalhe.jsx) encontra a viatura correta e mostra os detalhes

### 3. Formulário de contacto

- frontend envia para `POST /api/contact`
- backend guarda em `contact_messages`

### 4. Formulário de test drive

- a página `/test-drive` exige sessão iniciada
- frontend envia para `POST /api/test-drives`
- backend guarda em `test_drives`

### 5. Formulário de retoma

- a página `/retoma` exige sessão iniciada
- frontend envia para `POST /api/trade-ins`
- backend guarda em `trade_in_requests`

### 6. Simulador e pedido de financiamento

- a página `/financiamento` exige sessão iniciada
- o utilizador simula valores de financiamento e envia o pedido
- frontend envia para `POST /api/finance-requests`
- backend guarda em `finance_requests`

### 7. Login e registo

- registo: `POST /api/auth/register`
- login: `POST /api/auth/login`
- o backend cria uma sessão autenticada por cookie `HttpOnly`
- o frontend guarda localmente apenas os dados do utilizador para a interface

### 8. Painel admin

- login admin: `POST /api/admin/login`
- rotas protegidas por JWT
- as rotas admin funcionam por sessão autenticada via cookie
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

Os estilos estão divididos em dois níveis:

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

Por página/área:
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

Tudo é importado a partir de [src/index.css](src/index.css).

## Como Explicar o Projeto

Resumo simples:

"O projeto está dividido em duas partes: frontend em React e backend em Express. O frontend trata da interface, páginas, componentes e formulários. O backend trata da autenticação, CRUD de viaturas, gestão de retomas, utilizadores e ligação à base de dados MySQL. A comunicação entre ambos é feita por API REST."

Se quiseres uma explicação mais detalhada da arquitetura, abre:
- [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md)

## Documentação Disponível

- [docs/PROJECT_MAP.md](docs/PROJECT_MAP.md)
  Mapa geral do projeto: pastas, ficheiros importantes, rotas e forma certa de ler o código.

- [docs/API_REFERENCE.md](docs/API_REFERENCE.md)
  Lista dos endpoints do backend, o que recebem e o que devolvem.

- [docs/DATABASE.md](docs/DATABASE.md)
  Explicação simples das tabelas principais da base de dados e da sua função no projeto.

- [docs/PRESENTATION_GUIDE.md](docs/PRESENTATION_GUIDE.md)
  Guia de apresentação oral para explicares o projeto com segurança.

- [docs/PRESENTATION_SETUP.md](docs/PRESENTATION_SETUP.md)
  Checklist técnica para preparar MySQL, variáveis de ambiente, admin e arranque da demo.

## Comandos Úteis

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

Já implementado:
- catálogo dinâmico
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
- rotas protegidas para financiamento, retoma, test drive e área de conta

## Sugestão de Próximos Passos

- revisão final de UX e mobile
- reforcar testes dos endpoints principais
- rever textos, acentos e consistência visual
- preparar base de dados e credenciais para a apresentação
