# Mapa do Projeto

O projeto esta organizado por areas. A regra e simples: tudo o que pertence a uma area fica dentro da feature dessa area.

Para um mapa visual com graficos, abre [CODE_ORGANIZATION_MAP.md](CODE_ORGANIZATION_MAP.md).

## Estrutura Principal

```text
src/
  app/
    App.jsx

  features/
    home/
    blog/
    vehicles/
    contact/
    finance/
    trade-in/
    test-drive/
    auth/
    admin/
    about/
    not-found/

  shared/
    components/
    hooks/
    services/

  styles/
    base/
    componentes/
    layout/
    variaveis/
    index.css

server/
  index.js
  routes/
  middleware/
  lib/
  tests/
```

## Estrutura De Uma Feature

Cada feature pode ter estas pastas, mas so mantém as que realmente usa. Nao ha pastas vazias so para completar a estrutura.

```text
feature-name/
  pages/       paginas dessa area
  components/  componentes especificos dessa area
  data/        textos, listas e configuracoes
  hooks/       logica React reutilizavel
  services/    chamadas HTTP
  styles/      CSS dessa area
  utils/       funcoes auxiliares
```

Exemplo: se a feature `about` nao precisa de `services`, essa pasta nao existe.

- `pages`: paginas completas que aparecem nas rotas.
- `components`: partes pequenas usadas pelas paginas.
- `data`: textos, listas e configuracoes da area.
- `hooks`: logica React reutilizavel.
- `services`: chamadas HTTP dessa area.
- `styles`: CSS dessa area.
- `utils`: funcoes auxiliares dessa area.

## Onde Esta Cada Area

```text
Home              -> src/features/home
Blog              -> src/features/blog
Catalogo          -> src/features/vehicles
Detalhe viatura   -> src/features/vehicles
Contacto          -> src/features/contact
Financiamento     -> src/features/finance
Retoma            -> src/features/trade-in
Test drive        -> src/features/test-drive
Login/registo     -> src/features/auth
Admin             -> src/features/admin
Sobre             -> src/features/about
404               -> src/features/not-found
```

## Services Do Frontend

As chamadas API ja nao estao num ficheiro generico. Agora cada area tem o seu service:

```text
src/features/vehicles/services/vehiclesApi.js
src/features/contact/services/contactApi.js
src/features/finance/services/financeApi.js
src/features/trade-in/services/tradeInApi.js
src/features/test-drive/services/testDriveApi.js
src/features/auth/services/authApi.js
src/features/admin/services/adminApi.js
```

Todas usam a funcao base:

```text
src/shared/services/http.js
```

## Backend

O backend tambem esta separado por areas:

```text
server/routes/
  healthRoutes.js
  vehicleRoutes.js
  contactRoutes.js
  financeRoutes.js
  testDriveRoutes.js
  tradeInRoutes.js
  authRoutes.js
  adminRoutes.js
  publicRouteHelpers.js
```

Middleware:

```text
server/middleware/
  requireUserLogin.js
  requireAdminLogin.js
  authRateLimit.js
```

## Fluxo Mais Importante

Exemplo: catalogo.

```text
Catalogo.jsx
  -> useVehicles.js
  -> vehiclesApi.js
  -> requestJson()
  -> GET /api/vehicles
  -> vehicleRoutes.js
  -> tabela vehicles no MySQL
```

Exemplo: retoma.

```text
Retoma.jsx
  -> tradeInApi.js
  -> requestJson()
  -> POST /api/trade-ins
  -> tradeInRoutes.js
  -> tabela trade_in_requests no MySQL
```

## Ordem Para Estudar

1. `src/app/App.jsx`
2. `src/features/*/pages`
3. `src/features/*/services`
4. `src/shared/services/http.js`
5. `server/index.js`
6. `server/routes`
7. `server/ligacaoBaseDados.js`
