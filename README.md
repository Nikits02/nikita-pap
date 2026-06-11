# NikitaMotors

NikitaMotors é um projeto PAP de um stand automóvel premium. O objetivo é simular uma plataforma completa onde visitantes podem consultar viaturas, pedir contacto, marcar test drives, pedir retomas e simular financiamentos. O projeto também inclui autenticação de utilizadores e uma área de administração para gerir os dados principais.

## Como o Projeto Funciona

O projeto está dividido em duas partes:

- **Frontend:** aplicação React com Vite, responsável pelas páginas, interface, formulários e navegação.
- **Backend:** API em Node.js + Express, responsável pela autenticação, validações, comunicação com MySQL e gestão dos dados.

O frontend comunica com o backend através de rotas `/api`. Durante o desenvolvimento, o Vite encaminha esses pedidos para o servidor Express através do proxy configurado em `vite.config.js`.

## Principais Características

- Catálogo de viaturas carregado a partir da base de dados.
- Página de detalhe para cada viatura.
- Pesquisa e filtros por marca, modelo, combustível, caixa e ordenação.
- Sistema de login e registo de utilizadores.
- Rotas privadas para financiamento, retoma, test drive e conta.
- Formulário de contacto.
- Pedido de test drive com escolha de viatura, data e hora.
- Pedido de retoma com validação de quilometragem e dados da viatura.
- Simulador de financiamento ligado às viaturas disponíveis.
- Painel de administração protegido.
- Gestão admin de viaturas, utilizadores, contactos, retomas, financiamentos e test drives.
- Upload de imagens de viaturas no painel admin.
- Validações no frontend e no backend.
- Base de dados MySQL preparada automaticamente no arranque do servidor.

## Tecnologias Utilizadas

Frontend:

- React
- React Router
- Vite
- CSS modular organizado por áreas do projeto

Backend:

- Node.js
- Express
- MySQL
- JWT
- bcryptjs
- Nodemailer

## Estrutura Principal

```text
src/
  app/          rotas principais da aplicação React
  features/     páginas, componentes, dados e estilos por área
  shared/       componentes, hooks e serviços reutilizáveis
  styles/       estilos globais, variáveis e layout geral

server/
  index.js      arranque da API Express
  routes/       endpoints da API
  lib/          funções auxiliares do backend
  middleware/   autenticação e permissões
  uploads/      imagens carregadas pelo admin
```

## Páginas Principais

Públicas:

- `/`
- `/catalogo`
- `/viaturas/:slug`
- `/contacto`
- `/blog`
- `/sobre`
- `/login`
- `/registo`

Privadas:

- `/conta`
- `/financiamento`
- `/retoma`
- `/test-drive`

Admin:

- `/admin/login`
- `/admin`
- `/admin/viaturas`
- `/admin/contactos`
- `/admin/retomas`
- `/admin/financiamentos`
- `/admin/test-drives`
- `/admin/utilizadores`

## Base de Dados

O projeto usa MySQL. As principais tabelas são:

- `admins`
- `users`
- `vehicles`
- `contact_messages`
- `test_drives`
- `trade_in_requests`
- `finance_requests`

O backend cria e atualiza as tabelas principais automaticamente quando arranca.

## Como Executar

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

Antes de arrancar o backend, é necessário criar o ficheiro `server/.env` com base em `server/.env.example`.

Variáveis principais:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

Criar conta admin:

```powershell
cd server
npm run create-admin -- admin Admin123
```

## Comandos Úteis

Frontend:

```powershell
npm run dev
npm run build
npm run lint
```

Backend:

```powershell
cd server
npm run dev
npm run start
npm run create-admin -- admin Admin123
```

## Resumo Para Apresentação

Este projeto representa um stand automóvel premium com frontend em React e backend em Express. A aplicação permite consultar viaturas, fazer pedidos de contacto, test drive, retoma e financiamento. Também tem autenticação de utilizadores e uma área admin onde é possível gerir viaturas, pedidos e utilizadores. Os dados são guardados numa base de dados MySQL e a comunicação entre frontend e backend é feita através de uma API REST.

## Documentação Extra

Os comandos SQL para verificar os dados guardados estão em:

[docs/VERIFICAR_BASE_DADOS.md](docs/VERIFICAR_BASE_DADOS.md)
