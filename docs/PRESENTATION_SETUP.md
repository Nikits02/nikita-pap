# Preparacao Para a Apresentacao

Este ficheiro serve para reduzir o risco de a demo falhar por causa da configuração local.

## 1. Preparar MySQL

No MySQL, cria a base de dados antes de arrancar o backend:

```sql
CREATE DATABASE IF NOT EXISTS nikita_stand
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

O backend cria automaticamente as tabelas principais no arranque:
- `admins`
- `users`
- `vehicles`
- `test_drives`
- `contact_messages`
- `trade_in_requests`
- `finance_requests`

## 2. Preparar Variáveis de Ambiente

Na pasta `server`, cria um ficheiro `.env` com base em:

```text
server/.env.example
```

Exemplo:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=a_tua_password
DB_NAME=nikita_stand
JWT_SECRET=um_segredo_grande_para_a_demo
PORT=3002
CORS_ORIGIN=http://localhost:5174,http://127.0.0.1:5174
```

## 3. Criar Admin

Depois de configurares o `.env`, cria ou atualiza a conta admin:

```powershell
cd server
npm run create-admin -- admin Admin123
```

Se o admin ja existir, o comando atualiza a password.

## 4. Arrancar a Demo

Terminal 1:

```powershell
cd server
npm install
npm run dev
```

Terminal 2:

```powershell
npm install
npm run dev
```

URLs:
- Frontend: `http://localhost:5174`
- Backend: `http://localhost:3002/api/health`
- Admin: `http://localhost:5174/admin/login`

## 5. Checklist Antes da Defesa

- `npm run build` passa no frontend.
- `npm run lint` passa.
- `npm run test:server` passa.
- `http://localhost:3002/api/health` devolve `{ "ok": true }`.
- O login admin funciona.
- O catálogo abre sem login.
- O detalhe de uma viatura abre sem login.
- O test drive redireciona para login quando não ha sessão.
- Existe pelo menos uma viatura no admin/catalogo para demonstrar.





