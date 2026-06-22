# Configurar o Projeto Noutro PC

Este guia explica como preparar o projeto Nikita Motors num computador novo, passo a passo.

O projeto tem duas partes:

- Frontend: React + Vite, na pasta principal do projeto.
- Backend: Node.js + Express + MySQL, na pasta `server`.

## 1. Instalar Programas Necessarios

No outro PC, instala:

- Git
- Node.js `22.12.0` ou superior, ou entao Node.js `20.19.0` ou superior
- MySQL Server
- Visual Studio Code, opcional mas recomendado

Depois confirma as instalacoes no PowerShell:

```powershell
git --version
node --version
npm --version
mysql --version
```

Se algum comando nao funcionar, fecha e volta a abrir o PowerShell. Se continuar sem funcionar, o programa pode nao estar no `PATH`.

## 2. Obter o Projeto

Se o projeto estiver num repositorio Git:

```powershell
git clone <URL_DO_REPOSITORIO>
cd nikita-pap
```

Se o projeto foi passado por uma pen ou ficheiro `.zip`, copia a pasta para o PC novo e abre-a no PowerShell:

```powershell
cd C:\caminho\para\nikita-pap
```

Nao copies as pastas `node_modules` e `dist`. Elas sao criadas novamente com os comandos abaixo.

## 3. Instalar Dependencias do Frontend

Na pasta principal do projeto:

```powershell
npm install
```

Este comando instala as dependencias do React, Vite e restantes pacotes do frontend.

## 4. Instalar Dependencias do Backend

Entra na pasta do servidor:

```powershell
cd server
npm install
cd ..
```

Isto instala Express, MySQL, JWT, bcrypt, Nodemailer e as restantes dependencias do backend.

## 5. Preparar a Base de Dados MySQL

Garante que o MySQL Server esta ligado.

Depois entra no MySQL:

```powershell
mysql -u root -p
```

Tens duas opcoes:

### Opcao A: criar uma base de dados vazia

Usa esta opcao se queres comecar o projeto sem dados no outro PC.

Cria a base de dados usada pelo projeto:

```sql
CREATE DATABASE nikita_stand CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
EXIT;
```

Neste caso, quando arrancares o backend, ele cria automaticamente as tabelas principais. A base de dados fica vazia e depois podes adicionar viaturas pela area admin.

### Opcao B: passar a base de dados deste PC para o outro

Usa esta opcao se queres manter os dados atuais, como viaturas, admins, utilizadores e pedidos.

No PC antigo, exporta a base de dados:

```powershell
mysqldump -u root -p nikita_stand > nikita_stand_backup.sql
```

Copia o ficheiro `nikita_stand_backup.sql` para o PC novo.

No PC novo, cria a base de dados se o ficheiro exportado nao a criar automaticamente:

```powershell
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS nikita_stand CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Depois importa o backup:

```powershell
mysql -u root -p nikita_stand < nikita_stand_backup.sql
```

Se importares a base de dados completa, nao precisas de criar as tabelas manualmente nem de criar outra conta admin, porque esses dados ja vêm no backup.

Se o MySQL estiver a usar outra porta, por exemplo `3307`, entra assim:

```powershell
mysql -u root -p -P 3307
```

Nesse caso, tambem tens de colocar `DB_PORT=3307` no ficheiro `.env`.

Nota: o backend exige que `DB_PASSWORD` esteja preenchido. Se o teu utilizador `root` do MySQL nao tiver password, define uma password no MySQL ou cria um utilizador proprio para este projeto.

Opcionalmente, podes criar um utilizador so para o projeto:

```sql
CREATE USER IF NOT EXISTS 'nikita_user'@'localhost' IDENTIFIED BY 'Nikita123!';
GRANT ALL PRIVILEGES ON nikita_stand.* TO 'nikita_user'@'localhost';
FLUSH PRIVILEGES;
```

Se fizeres isto, no `.env` usa:

```env
DB_USER=nikita_user
DB_PASSWORD=Nikita123!
```

## 6. Criar o Ficheiro `.env` do Backend

O backend precisa de um ficheiro `server/.env`.

Cria-o a partir do exemplo:

```powershell
Copy-Item server\.env.example server\.env
```

Abre o ficheiro:

```powershell
notepad server\.env
```

Exemplo de configuracao local:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=a_password_do_teu_mysql
DB_NAME=nikita_stand
JWT_SECRET=um_segredo_grande_para_tokens
PORT=3002
CORS_ORIGIN=http://localhost:5174,http://127.0.0.1:5174
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

As variaveis obrigatorias sao:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

As variaveis `SMTP_*` servem apenas para envio de emails. Em ambiente local podem ficar vazias.

## 7. Arrancar o Backend

Num terminal, dentro da pasta `server`:

```powershell
cd server
npm run dev
```

Se correr bem, deve aparecer uma mensagem parecida com:

```text
API ligada na porta 3002
```

Quando o backend arranca, ele cria automaticamente as tabelas principais na base de dados:

- `admins`
- `users`
- `vehicles`
- `contact_messages`
- `test_drives`
- `trade_in_requests`
- `finance_requests`

Mantem este terminal aberto.

## 8. Criar uma Conta de Administrador

Abre outro terminal na pasta principal do projeto e executa:

```powershell
cd server
npm run create-admin -- admin Admin123
```

Podes trocar `admin` e `Admin123` por outros dados.

A password tem de ter pelo menos 6 caracteres.

## 9. Arrancar o Frontend

Abre outro terminal na pasta principal do projeto:

```powershell
npm run dev
```

O frontend esta configurado para usar a porta `5174`.

Abre no browser:

```text
http://localhost:5174
```

O Vite encaminha os pedidos `/api` e `/uploads` para o backend em:

```text
http://localhost:3002
```

Por isso, para o projeto funcionar corretamente, deves ter os dois terminais ligados:

- Backend: `cd server` e `npm run dev`
- Frontend: `npm run dev`

## 10. Entrar na Area Admin

Com o frontend aberto, entra em:

```text
http://localhost:5174/admin/login
```

Usa a conta criada no passo 8.

Depois podes gerir:

- Viaturas
- Contactos
- Retomas
- Financiamentos
- Test drives
- Utilizadores

Num PC novo, a base de dados comeca vazia. Para aparecerem viaturas no catalogo, adiciona-as pela area admin.

## 11. Verificar se a Base de Dados Ficou Correta

Podes confirmar as tabelas no MySQL:

```powershell
mysql -u root -p
```

```sql
USE nikita_stand;
SHOW TABLES;
SELECT id, username, created_at FROM admins;
EXIT;
```

Tambem existe um guia com comandos SQL mais completos: [VERIFICAR_BASE_DADOS.md](VERIFICAR_BASE_DADOS.md).

## 12. Comandos Uteis

Frontend, na pasta principal:

```powershell
npm run dev
npm run build
npm run lint
npm run preview
```

Backend, na pasta `server`:

```powershell
npm run dev
npm run start
npm run create-admin -- admin Admin123
```

## 13. Problemas Comuns

### Erro: `Variavel de ambiente obrigatoria em falta`

Verifica se existe o ficheiro:

```text
server/.env
```

Confirma tambem se preencheste `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` e `JWT_SECRET`.

### Erro: `Access denied for user`

A password do MySQL no ficheiro `server/.env` esta errada, ou o utilizador indicado em `DB_USER` nao tem permissao.

### Erro: `Unknown database 'nikita_stand'`

A base de dados ainda nao foi criada.

Entra no MySQL e executa:

```sql
CREATE DATABASE nikita_stand CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Erro: porta `5174` ocupada

O frontend usa `strictPort: true`, por isso precisa mesmo da porta `5174`.

Fecha o processo que esta a usar a porta ou altera a porta em `vite.config.js`.

### Erro: porta `3002` ocupada

Altera a variavel `PORT` em `server/.env`, por exemplo:

```env
PORT=3003
```

Se mudares a porta do backend, tambem tens de atualizar `backendTarget` em `vite.config.js`.

### O catalogo aparece vazio

Num PC novo, a tabela `vehicles` nao tem dados.

Cria uma conta admin, entra na area admin e adiciona as viaturas.

### Imagens enviadas pelo admin nao aparecem depois de copiar o projeto

As imagens carregadas ficam em `server/uploads`, que nao entra no Git.

Se precisares de passar imagens de um PC para outro, copia tambem a pasta:

```text
server/uploads
```

## 14. Ordem Recomendada Para Apresentacao

Quando fores preparar o projeto rapidamente noutro PC, segue esta ordem:

```text
1. Instalar Git, Node.js e MySQL
2. Copiar ou clonar o projeto
3. npm install na pasta principal
4. npm install dentro de server
5. Criar a base de dados nikita_stand
6. Criar e preencher server/.env
7. Arrancar backend
8. Criar admin
9. Arrancar frontend
10. Abrir http://localhost:5174
```
