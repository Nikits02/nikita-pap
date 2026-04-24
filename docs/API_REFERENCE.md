# API Reference

Este ficheiro documenta a API do backend de forma simples e prática.

Base URL em desenvolvimento:
- `http://localhost:3002`

No frontend, os pedidos são feitos para `/api/...` e o Vite encaminha para o backend via proxy.

## 1. Endpoints Públicos

### `GET /api/health`

Objetivo:
- verificar se a API está ativa

Resposta esperada:
```json
{ "ok": true }
```

### `GET /api/vehicles`

Objetivo:
- devolver todas as viaturas para o catálogo, homepage, footer, detalhe e outras zonas do site

Usado por:
- `src/hooks/useVehicles.js`

Resposta:
- array de viaturas vindas da tabela `vehicles`

Campos mais importantes:
- `id`
- `marca`
- `modelo`
- `versao`
- `preco`
- `ano`
- `potencia`
- `quilometragem`
- `combustivel`
- `caixa`
- `imagem`
- `source`
- `novidade`
- `inserted_at`

### `POST /api/test-drives`

Objetivo:
- guardar um pedido de test drive

Body esperado:
```json
{
  "vehicleSlug": "catalog-16-tesla-model-s",
  "dataPreferida": "2026-04-20",
  "horaPreferida": "10:00",
  "nome": "Nome do cliente",
  "telefone": "912345678",
  "email": "cliente@email.pt"
}
```

Validações:
- todos os campos são obrigatórios
- a data não pode estar no passado
- a hora tem de estar dentro dos horários disponíveis
- o telefone tem de ter formato válido
- a viatura tem de existir no catálogo

Resposta de sucesso:
```json
{ "ok": true }
```

### `POST /api/contact`

Objetivo:
- guardar uma mensagem enviada no formulário de contacto

Body esperado:
```json
{
  "nome": "Nome do cliente",
  "email": "cliente@email.pt",
  "telefone": "912345678",
  "assunto": "Pedido de Informação",
  "mensagem": "Texto da mensagem"
}
```

Validações:
- `nome`, `email`, `assunto` e `mensagem` são obrigatórios
- se o telefone for preenchido, tem de ter formato válido

Resposta de sucesso:
```json
{ "ok": true }
```

### `POST /api/trade-ins`

Objetivo:
- guardar um pedido de retoma

Body esperado:
```json
{
  "marca": "BMW",
  "modelo": "320d",
  "ano": 2021,
  "quilometragem": 45000,
  "estado": "Muito Bom",
  "nome": "Nome do cliente",
  "telefone": "912345678",
  "email": "cliente@email.pt",
  "observacoes": "Texto opcional"
}
```

Validações:
- `marca`
- `modelo`
- `ano`
- `quilometragem`
- `estado`
- `nome`
- `telefone`
- `email`

Regras adicionais:
- `ano` tem de ser inteiro válido
- `quilometragem` não pode ser negativa
- `telefone` tem de ter formato válido

Resposta de sucesso:
```json
{ "ok": true }
```

### `POST /api/auth/register`

Objetivo:
- criar uma conta normal de utilizador

Body esperado:
```json
{
  "nome": "Nome",
  "username": "username",
  "email": "email@email.pt",
  "password": "password123"
}
```

Validações:
- todos os campos obrigatórios
- password com pelo menos 6 caracteres
- `username` e `email` únicos

Resposta de sucesso:
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "nome": "Nome",
    "username": "username",
    "email": "email@email.pt",
    "role": "user"
  }
}
```

### `POST /api/auth/login`

Objetivo:
- iniciar sessão como utilizador normal ou admin

Body esperado:
```json
{
  "identifier": "username ou email",
  "password": "password123"
}
```

Nota:
- o backend aceita `identifier` ou `username`

Resposta:
- devolve os dados do utilizador e cria uma sessão autenticada por cookie `HttpOnly`

### `POST /api/admin/login`

Objetivo:
- iniciar sessão diretamente na área admin

Body esperado:
```json
{
  "username": "admin",
  "password": "Admin123"
}
```

Resposta:
- devolve os dados do admin e cria uma sessão autenticada por cookie `HttpOnly`

### `GET /api/auth/session`

Objetivo:
- validar a sessão atual com base no cookie autenticado

Resposta de sucesso:
```json
{
  "ok": true,
  "user": {
    "id": 1,
    "nome": "Nome",
    "username": "username",
    "email": "email@email.pt",
    "role": "user"
  }
}
```

### `POST /api/auth/logout`

Objetivo:
- terminar a sessão atual e limpar o cookie autenticado

Resposta de sucesso:
```json
{ "ok": true }
```

## 2. Endpoints Protegidos de Admin

Todos estes endpoints exigem uma sessão autenticada de administrador.

A validação principal é feita por cookie de sessão `HttpOnly`.

O acesso é validado em:
- [server/middleware/authenticateAdmin.js](../server/middleware/authenticateAdmin.js)

### `POST /api/admin/uploads/vehicle-image`

Objetivo:
- carregar imagem de viatura em base64 e guardar em disco

Body esperado:
```json
{
  "fileName": "foto.png",
  "dataUrl": "data:image/png;base64,..."
}
```

Resposta:
```json
{
  "imagem": "/uploads/vehicles/nome-gerado.png"
}
```

### `GET /api/admin/vehicles`

Objetivo:
- listar todas as viaturas no painel admin

### `GET /api/admin/vehicles/:id`

Objetivo:
- obter uma viatura específica para editar no painel admin

### `POST /api/admin/vehicles`

Objetivo:
- criar nova viatura

### `PUT /api/admin/vehicles/:id`

Objetivo:
- atualizar viatura existente

### `DELETE /api/admin/vehicles/:id`

Objetivo:
- eliminar viatura

### `GET /api/admin/trade-ins`

Objetivo:
- listar pedidos de retoma

Campos relevantes:
- `id`
- `marca`
- `modelo`
- `ano`
- `quilometragem`
- `estado_geral`
- `nome`
- `telefone`
- `email`
- `observacoes`
- `is_viewed`
- `created_at`

### `PATCH /api/admin/trade-ins/:id`

Objetivo:
- marcar pedido de retoma como visto ou por ver

Body esperado:
```json
{
  "isViewed": true
}
```

### `DELETE /api/admin/trade-ins/:id`

Objetivo:
- eliminar pedido de retoma

### `GET /api/admin/users`

Objetivo:
- listar utilizadores registados

### `DELETE /api/admin/users/:id`

Objetivo:
- eliminar utilizador

## 3. Como o Frontend Usa a API

Camadas:

1. `src/services/http.js`
   Faz o pedido HTTP base.

2. `src/services/api.js`
   Endpoints públicos.

3. `src/services/authApi.js`
   Login, registo, validação da sessão e persistência local do utilizador.

4. `src/services/adminApi.js`
   Endpoints protegidos do admin suportados por sessão via cookie.

## 4. Erros e Mensagens

O backend tenta sempre devolver mensagens simples em português, por exemplo:
- `Campos em falta.`
- `Credenciais inválidas.`
- `Email inválido.`
- `Token em falta.`
- `Utilizador não encontrado.`
- `Pedido de retoma não encontrado.`
- `Demasiadas tentativas. Tente novamente dentro de alguns minutos.`

O frontend usa essas mensagens para mostrar erros diretamente ao utilizador.

## 5. Notas de Segurança

- o backend valida `JWT_SECRET` no arranque
- o CORS passa a aceitar apenas as origens configuradas
- a autenticação usa cookie `HttpOnly` para reduzir dependência de token no browser
- os endpoints de `login` e `register` têm limitação básica de tentativas por IP
