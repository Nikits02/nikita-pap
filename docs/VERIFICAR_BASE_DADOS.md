# Verificar Dados na Base de Dados

Este ficheiro tem comandos SQL para confirmar rapidamente se os dados estao a ser guardados na base de dados `nikita_stand`.

## Entrar no MySQL

```powershell
mysql -u root -p
```

Se estiveres a usar a porta `3307`:

```powershell
mysql -u root -p -P 3307
```

Depois escolhe a base de dados:

```sql
USE nikita_stand;
```

## Ver Tabelas Existentes

```sql
SHOW TABLES;
```

## Ver Estrutura das Tabelas

```sql
DESCRIBE admins;
DESCRIBE users;
DESCRIBE vehicles;
DESCRIBE contact_messages;
DESCRIBE test_drives;
DESCRIBE trade_in_requests;
DESCRIBE finance_requests;
```

## Ver Quantidade de Registos

```sql
SELECT 'admins' AS tabela, COUNT(*) AS total FROM admins
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'vehicles', COUNT(*) FROM vehicles
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages
UNION ALL
SELECT 'test_drives', COUNT(*) FROM test_drives
UNION ALL
SELECT 'trade_in_requests', COUNT(*) FROM trade_in_requests
UNION ALL
SELECT 'finance_requests', COUNT(*) FROM finance_requests;
```

## Ver Administradores

```sql
SELECT id, username, created_at
FROM admins
ORDER BY id DESC;
```

## Ver Utilizadores

```sql
SELECT id, nome, username, email, created_at
FROM users
ORDER BY id DESC;
```

## Ver Viaturas

```sql
SELECT
  id,
  source,
  marca,
  modelo,
  versao,
  preco,
  ano,
  quilometragem,
  combustivel,
  caixa,
  novidade,
  inserted_at
FROM vehicles
ORDER BY id DESC;
```

## Ver Mensagens de Contacto

```sql
SELECT
  id,
  nome,
  email,
  telefone,
  assunto,
  status,
  created_at
FROM contact_messages
ORDER BY id DESC;
```

Para ver tambem a mensagem completa:

```sql
SELECT id, nome, assunto, mensagem, created_at
FROM contact_messages
ORDER BY id DESC;
```

## Ver Pedidos de Test Drive

```sql
SELECT
  id,
  vehicle_label,
  vehicle_slug,
  nome,
  telefone,
  email,
  data_preferida,
  hora_preferida,
  status,
  created_at
FROM test_drives
ORDER BY id DESC;
```

## Ver Pedidos de Retoma

```sql
SELECT
  id,
  marca,
  modelo,
  ano,
  quilometragem,
  estado_geral,
  nome,
  telefone,
  email,
  status,
  is_viewed,
  created_at
FROM trade_in_requests
ORDER BY id DESC;
```

Para ver tambem as observacoes:

```sql
SELECT id, marca, modelo, nome, observacoes, created_at
FROM trade_in_requests
ORDER BY id DESC;
```

## Ver Pedidos de Financiamento

```sql
SELECT
  id,
  nome,
  email,
  telefone,
  viatura,
  preco,
  entrada,
  meses,
  taxa,
  prestacao_mensal,
  montante_total,
  taeg,
  status,
  created_at
FROM finance_requests
ORDER BY id DESC;
```

## Ver Ultimos Dados Inseridos

```sql
SELECT 'contacto' AS tipo, id, nome, created_at
FROM contact_messages
UNION ALL
SELECT 'test_drive', id, nome, created_at
FROM test_drives
UNION ALL
SELECT 'retoma', id, nome, created_at
FROM trade_in_requests
UNION ALL
SELECT 'financiamento', id, nome, created_at
FROM finance_requests
ORDER BY created_at DESC
LIMIT 20;
```

## Ver Pedidos Ainda Por Tratar

```sql
SELECT 'contactos' AS tipo, COUNT(*) AS total
FROM contact_messages
WHERE COALESCE(NULLIF(status, ''), 'new') = 'new'
UNION ALL
SELECT 'test_drives', COUNT(*)
FROM test_drives
WHERE COALESCE(NULLIF(status, ''), 'new') = 'new'
UNION ALL
SELECT 'retomas', COUNT(*)
FROM trade_in_requests
WHERE COALESCE(NULLIF(status, ''), 'new') = 'new'
UNION ALL
SELECT 'financiamentos', COUNT(*)
FROM finance_requests
WHERE COALESCE(NULLIF(status, ''), 'new') = 'new';
```
