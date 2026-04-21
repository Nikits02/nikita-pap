# API Reference

Este ficheiro documenta a API do backend de forma simples e pratica.

Base URL em desenvolvimento:
- `http://localhost:3002`

No frontend, os pedidos sao feitos para `/api/...` e o Vite encaminha para o backend via proxy.

## 1. Endpoints Publicos

### `GET /api/health`

Objetivo:
- verificar se a API esta ativa

Resposta esperada:
```json
{ "ok": true }
```

### `GET /api/vehicles`

Objetivo:
- devolver todas as viaturas para o catalogo, homepage, footer, detalhe e outras zonas do site

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

Validacoes:
- todos os campos sao obrigatorios

Resposta de sucesso:
```json
{ "ok": true }
```

### `POST /api/contact`

Objetivo:
- guardar uma mensagem enviada no formulario de contacto

Body esperado:
```json
{
  "nome": "Nome do cliente",
  "email": "cliente@email.pt",
  "telefone": "912345678",
  "assunto": "Pedido de Informacao",
  "mensagem": "Texto da mensagem"
}
```

Validacoes:
- `nome`, `email`, `assunto` e `mensagem` sao obrigatorios

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

Validacoes:
- `marca`
- `modelo`
- `ano`
- `quilometragem`
- `estado`
- `nome`
- `telefone`
- `email`

Regras adicionais:
- `ano` tem de ser inteiro valido
- `quilometragem` nao pode ser negativa

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

Validacoes:
- todos os campos obrigatorios
- password com pelo menos 6 caracteres
- `username` e `email` unicos

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
- iniciar sessao como utilizador normal ou admin

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
- devolve os dados do utilizador e cria uma sessao autenticada por cookie `HttpOnly`

### `POST /api/admin/login`

Objetivo:
- iniciar sessao diretamente na area admin

Body esperado:
```json
{
  "username": "admin",
  "password": "Admin123"
}
```

Resposta:
- devolve os dados do admin e cria uma sessao autenticada por cookie `HttpOnly`

### `GET /api/auth/session`

Objetivo:
- validar a sessao atual com base no cookie autenticado

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
- terminar a sessao atual e limpar o cookie autenticado

Resposta de sucesso:
```json
{ "ok": true }
```

## 2. Endpoints Protegidos de Admin

Todos estes endpoints exigem uma sessao autenticada de administrador.

A validacao principal e feita por cookie de sessao `HttpOnly`.

O acesso e validado em:
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
- obter uma viatura especifica para editar no painel admin

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
   Endpoints publicos.

3. `src/services/authApi.js`
   Login, registo, validacao da sessao e persistencia local do utilizador.

4. `src/services/adminApi.js`
   Endpoints protegidos do admin suportados por sessao via cookie.

## 4. Erros e Mensagens

O backend tenta sempre devolver mensagens simples em portugues, por exemplo:
- `Campos em falta.`
- `Credenciais invalidas.`
- `Email invalido.`
- `Token em falta.`
- `Utilizador nao encontrado.`
- `Pedido de retoma nao encontrado.`
- `Demasiadas tentativas. Tente novamente dentro de alguns minutos.`

O frontend usa essas mensagens para mostrar erros diretamente ao utilizador.

## 5. Notas de Seguranca

- o backend valida `JWT_SECRET` no arranque
- o CORS passa a aceitar apenas as origens configuradas
- a autenticacao usa cookie `HttpOnly` para reduzir dependencia de token no browser
- os endpoints de `login` e `register` têm limitacao basica de tentativas por IP
