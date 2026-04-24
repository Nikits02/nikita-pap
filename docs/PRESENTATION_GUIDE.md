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

Se falares sempre nesta ordem, a apresentação fica natural.

## 2. Discurso Curto Inicial

Podes dizer algo deste genero:

"Este projeto chama-se NikitaMotors e foi desenvolvido como PAP. O objetivo foi criar um website de um stand automóvel premium, com catálogo de viaturas, detalhe de cada veículo, formulários de contacto, test drive e retoma, autenticação de utilizadores e um painel de administração para gerir viaturas, retomas e utilizadores."

## 3. Como Explicar as Tecnologias

Frontend:

"No frontend usei React com Vite. O React foi usado para criar as páginas e os componentes reutilizáveis, enquanto o Vite facilitou o desenvolvimento e a compilacao do projeto."

Backend:

"No backend usei Node.js com Express para criar a API. Essa API recebe os pedidos do frontend, valida os dados e comunica com a base de dados MySQL."

Base de dados:

"Usei MySQL para guardar viaturas, utilizadores, admins e todos os pedidos enviados pelos formulários."

Autenticação:

"Para autenticação usei JWT e bcrypt. O bcrypt protege as passwords com hash e o JWT protege a área administrativa."

## 4. Como Explicar a Estrutura do Projeto

Forma curta:

"O projeto está dividido em frontend e backend. No frontend tenho páginas, componentes, hooks, services e utils. No backend tenho os endpoints da API, a ligação a base de dados, middleware de autenticação e funções auxiliares."

Forma prática:

- `src/pages`
  páginas principais

- `src/components`
  componentes reutilizáveis

- `src/services`
  ligação frontend -> backend

- `server/routes`
  endpoints da API separados por área

- `server/db.js`
  ligação MySQL

## 5. Como Explicar as Funcionalidades

### Catálogo

"As viaturas são carregadas do backend, e o frontend transforma os dados para mostrar o catálogo, o detalhe e outras zonas do site."

### Detalhe da viatura

"Cada viatura tem uma página propria com mais informação, imagem, dados técnicos e sugestões de outras viaturas."

### Contacto

"O formulário de contacto recolhe os dados do utilizador e guarda-os na base de dados."

### Test Drive

"O utilizador pode escolher a viatura, a data e a hora pretendida, e o pedido fica guardado no backend."

### Retoma

"O utilizador pode preencher os dados da viatura atual e os seus dados de contacto para pedir uma avaliação."

### Login e registo

"Foi implementado um sistema de autenticação com registo de utilizadores. O backend cria uma sessão por cookie HttpOnly e o frontend guarda apenas os dados básicos do utilizador para mostrar a interface."

### Admin

"O admin pode gerir viaturas, consultar pedidos de retoma, marcar esses pedidos como vistos e eliminar utilizadores."

## 6. Como Explicar o Fluxo Tecnico

Exemplo bom para mostrar que percebes:

"No frontend, uma página usa um hook ou um service para fazer um pedido HTTP. Esse pedido vai para um endpoint no backend. O backend valida os dados, fala com a base de dados e devolve a resposta. Depois o frontend atualiza o estado e mostra o resultado ao utilizador."

## 7. Onde Carregar Durante a Apresentacao

Se te pedirem para mostrar o código:

1. abre [src/App.jsx](../src/App.jsx)
   para mostrar as rotas

2. abre [src/services/api.js](../src/services/api.js)
   para mostrar como o frontend chama a API

3. abre [server/routes](../server/routes)
   para mostrar os endpoints separados por públicos, autenticação e admin

4. abre [server/db.js](../server/db.js)
   para mostrar a ligação MySQL

5. abre uma página concreta como:
   - [src/pages/public/Retoma.jsx](../src/pages/public/Retoma.jsx)
   - [src/pages/admin/AdminVehicles.jsx](../src/pages/admin/AdminVehicles.jsx)
   - [src/pages/admin/AdminTradeIns.jsx](../src/pages/admin/AdminTradeIns.jsx)

## 8. Perguntas Que Te Podem Fazer

### "Porque escolheste React?"

Resposta:

"Porque permite dividir o projeto em componentes reutilizáveis, organizar melhor a interface e gerir estados de forma clara."

### "Como o frontend comunica com o backend?"

Resposta:

"A comunicação é feita por pedidos HTTP para endpoints da API. No projeto, essa ligação está centralizada nos ficheiros da pasta `src/services`."

### "Como proteges a área admin?"

Resposta:

"A área admin usa JWT guardado num cookie HttpOnly. Quando o admin faz login, o backend cria a sessão e os pedidos protegidos são validados no middleware do backend."

### "Como guardas passwords?"

Resposta:

"As passwords não ficam guardadas em texto simples. São convertidas em hash com bcrypt."

### "Onde são guardadas as retomas?"

Resposta:

"Na tabela `trade_in_requests` da base de dados MySQL."

## 9. Dificuldades Que Podes Referir

Se quiseres falar de dificuldades, estás são credíveis e boas:

- organizacao do frontend e separacao em componentes
- ligação entre frontend, backend e base de dados
- autenticação e proteção do admin
- upload de imagens
- manter o projeto coerente visualmente e funcionalmente

## 10. O Que Podes Dizer Que Aprendeste

- estruturar um projeto full stack
- criar uma API com Express
- ligar React ao backend
- trabalhar com MySQL
- proteger rotas com JWT
- usar cookies HttpOnly para sessoes
- gerir formulários e validações
- organizar melhor o código e a documentação

## 11. Fecho da Apresentacao

Podes terminar assim:

"Este projeto permitiu-me aplicar conhecimentos de frontend, backend e base de dados num caso pratico e completo. Para além da parte técnica, ajudou-me a evoluir na organizacao do trabalho, na resolução de problemas e na construção de uma aplicação funcional de forma progressiva."
