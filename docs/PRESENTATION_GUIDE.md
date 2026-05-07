# Guia de Apresentacao

Este guia serve para te ajudar a explicar o projeto de forma simples, organizada e sem te perderes.

## 1. Estrutura Ideal da Explicacao

Segue esta ordem:

1. Objetivo do projeto
2. Tecnologias usadas
3. Estrutura geral
4. Funcionalidades principais
5. Backend e base de dados
6. Painel admin
7. Dificuldades e aprendizagens

Se falares sempre nesta ordem, a apresentaÃ§Ã£o fica natural.

## 2. Discurso Curto Inicial

Podes dizer algo deste genero:

"Este projeto chama-se NikitaMotors e foi desenvolvido como PAP. O objetivo foi criar um website de um stand automÃ³vel premium, com catÃ¡logo de viaturas, detalhe de cada veÃ­culo, formulÃ¡rios de contacto, test drive e retoma, autenticaÃ§Ã£o de utilizadores e um painel de administraÃ§Ã£o para gerir viaturas, retomas e utilizadores."

## 3. Como Explicar as Tecnologias

Frontend:

"No frontend usei React com Vite. O React foi usado para criar as pÃ¡ginas e os componentes reutilizÃ¡veis, enquanto o Vite facilitou o desenvolvimento e a compilacao do projeto."

Backend:

"No backend usei Node.js com Express para criar a API. Essa API recebe os pedidos do frontend, valida os dados e comunica com a base de dados MySQL."

Base de dados:

"Usei MySQL para guardar viaturas, utilizadores, admins e todos os pedidos enviados pelos formulÃ¡rios."

AutenticaÃ§Ã£o:

"Para autenticaÃ§Ã£o usei JWT e bcrypt. O bcrypt protege as passwords com hash e o JWT protege a Ã¡rea administrativa."

## 4. Como Explicar a Estrutura do Projeto

Forma curta:

"O projeto estÃ¡ dividido em frontend e backend. No frontend tenho pÃ¡ginas, componentes, hooks, services e utils. No backend tenho os endpoints da API, a ligaÃ§Ã£o a base de dados, middleware de autenticaÃ§Ã£o e funÃ§Ãµes auxiliares."

Forma prÃ¡tica:

- `src/pages`
  pÃ¡ginas principais

- `src/components`
  componentes reutilizÃ¡veis

- `src/services`
  ligaÃ§Ã£o frontend -> backend

- `server/routes`
  endpoints da API separados por Ã¡rea

- `server/databaseConnection.js`
  ligaÃ§Ã£o MySQL

## 5. Como Explicar as Funcionalidades

### CatÃ¡logo

"As viaturas sÃ£o carregadas do backend, e o frontend transforma os dados para mostrar o catÃ¡logo, o detalhe e outras zonas do site."

### Detalhe da viatura

"Cada viatura tem uma pÃ¡gina propria com mais informaÃ§Ã£o, imagem, dados tÃ©cnicos e sugestÃµes de outras viaturas."

### Contacto

"O formulÃ¡rio de contacto recolhe os dados do utilizador e guarda-os na base de dados."

### Test Drive

"O utilizador pode escolher a viatura, a data e a hora pretendida, e o pedido fica guardado no backend."

### Retoma

"O utilizador pode preencher os dados da viatura atual e os seus dados de contacto para pedir uma avaliaÃ§Ã£o."

### Login e registo

"Foi implementado um sistema de autenticaÃ§Ã£o com registo de utilizadores. O backend cria uma sessÃ£o por cookie HttpOnly e o frontend guarda apenas os dados bÃ¡sicos do utilizador para mostrar a interface."

### Admin

"O admin pode gerir viaturas, consultar pedidos de retoma, marcar esses pedidos como vistos e eliminar utilizadores."

## 6. Como Explicar o Fluxo Tecnico

Exemplo bom para mostrar que percebes:

"No frontend, uma pÃ¡gina usa um hook ou um service para fazer um pedido HTTP. Esse pedido vai para um endpoint no backend. O backend valida os dados, fala com a base de dados e devolve a resposta. Depois o frontend atualiza o estado e mostra o resultado ao utilizador."

## 7. Onde Carregar Durante a Apresentacao

Se te pedirem para mostrar o cÃ³digo:

1. abre [src/App.jsx](../src/App.jsx)
   para mostrar as rotas

2. abre [src/services/api.js](../src/services/api.js)
   para mostrar como o frontend chama a API

3. abre [server/routes](../server/routes)
   para mostrar os endpoints separados por pÃºblicos, autenticaÃ§Ã£o e admin

4. abre [server/databaseConnection.js](../server/databaseConnection.js)
   para mostrar a ligaÃ§Ã£o MySQL

5. abre uma pÃ¡gina concreta como:
   - [src/pages/public/Retoma.jsx](../src/pages/public/Retoma.jsx)
   - [src/pages/admin/AdminVehicles.jsx](../src/pages/admin/AdminVehicles.jsx)
   - [src/pages/admin/AdminTradeIns.jsx](../src/pages/admin/AdminTradeIns.jsx)

## 8. Perguntas Que Te Podem Fazer

### "Porque escolheste React?"

Resposta:

"Porque permite dividir o projeto em componentes reutilizÃ¡veis, organizar melhor a interface e gerir estados de forma clara."

### "Como o frontend comunica com o backend?"

Resposta:

"A comunicaÃ§Ã£o Ã© feita por pedidos HTTP para endpoints da API. No projeto, essa ligaÃ§Ã£o estÃ¡ centralizada nos ficheiros da pasta `src/services`."

### "Como proteges a Ã¡rea admin?"

Resposta:

"A Ã¡rea admin usa JWT guardado num cookie HttpOnly. Quando o admin faz login, o backend cria a sessÃ£o e os pedidos protegidos sÃ£o validados no middleware do backend."

### "Como guardas passwords?"

Resposta:

"As passwords nÃ£o ficam guardadas em texto simples. SÃ£o convertidas em hash com bcrypt."

### "Onde sÃ£o guardadas as retomas?"

Resposta:

"Na tabela `trade_in_requests` da base de dados MySQL."

## 9. Dificuldades Que Podes Referir

Se quiseres falar de dificuldades, estÃ¡s sÃ£o credÃ­veis e boas:

- organizacao do frontend e separacao em componentes
- ligaÃ§Ã£o entre frontend, backend e base de dados
- autenticaÃ§Ã£o e proteÃ§Ã£o do admin
- upload de imagens
- manter o projeto coerente visualmente e funcionalmente

## 10. O Que Podes Dizer Que Aprendeste

- estruturar um projeto full stack
- criar uma API com Express
- ligar React ao backend
- trabalhar com MySQL
- proteger rotas com JWT
- usar cookies HttpOnly para sessoes
- gerir formulÃ¡rios e validaÃ§Ãµes
- organizar melhor o cÃ³digo e a documentaÃ§Ã£o

## 11. Fecho da Apresentacao

Podes terminar assim:

"Este projeto permitiu-me aplicar conhecimentos de frontend, backend e base de dados num caso pratico e completo. Para alÃ©m da parte tÃ©cnica, ajudou-me a evoluir na organizacao do trabalho, na resoluÃ§Ã£o de problemas e na construÃ§Ã£o de uma aplicaÃ§Ã£o funcional de forma progressiva."
