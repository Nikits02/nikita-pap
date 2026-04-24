import { pool } from "../db.js";

async function fetchRows(query, params = []) {
  const [rows] = await pool.query(query, params);
  return rows;
}

async function ensureTableColumn(tableName, columnName, columnDefinitionSql) {
  const columns = await fetchRows(`SHOW COLUMNS FROM ${tableName} LIKE ?`, [
    columnName,
  ]);

  if (!columns.length) {
    await pool.query(`
      ALTER TABLE ${tableName}
      ADD COLUMN ${columnDefinitionSql}
    `);
  }
}

export async function ensureAuthTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      username VARCHAR(100) NOT NULL UNIQUE,
      email VARCHAR(150) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function ensureCatalogTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      source VARCHAR(40) NOT NULL DEFAULT 'catalog',
      marca VARCHAR(120) NOT NULL,
      modelo VARCHAR(120) NOT NULL,
      tipo VARCHAR(120) DEFAULT NULL,
      versao VARCHAR(160) DEFAULT NULL,
      preco DECIMAL(12, 2) NOT NULL,
      ano INT DEFAULT NULL,
      potencia VARCHAR(80) DEFAULT NULL,
      quilometragem VARCHAR(80) NOT NULL,
      combustivel VARCHAR(80) NOT NULL,
      caixa VARCHAR(80) NOT NULL,
      inserted_at DATE NOT NULL,
      novidade TINYINT(1) NOT NULL DEFAULT 0,
      imagem VARCHAR(500) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTableColumn(
    "vehicles",
    "source",
    "source VARCHAR(40) NOT NULL DEFAULT 'catalog' AFTER id",
  );
  await ensureTableColumn(
    "vehicles",
    "tipo",
    "tipo VARCHAR(120) DEFAULT NULL AFTER modelo",
  );
  await ensureTableColumn(
    "vehicles",
    "versao",
    "versao VARCHAR(160) DEFAULT NULL AFTER tipo",
  );
  await ensureTableColumn(
    "vehicles",
    "inserted_at",
    "inserted_at DATE NOT NULL AFTER caixa",
  );
  await ensureTableColumn(
    "vehicles",
    "novidade",
    "novidade TINYINT(1) NOT NULL DEFAULT 0 AFTER inserted_at",
  );
  await ensureTableColumn(
    "vehicles",
    "created_at",
    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
  );
}

export async function ensureLeadTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS test_drives (
      id INT AUTO_INCREMENT PRIMARY KEY,
      vehicle_slug VARCHAR(190) NOT NULL,
      vehicle_label VARCHAR(200) DEFAULT NULL,
      data_preferida DATE NOT NULL,
      hora_preferida VARCHAR(40) NOT NULL,
      nome VARCHAR(150) NOT NULL,
      telefone VARCHAR(60) NOT NULL,
      email VARCHAR(150) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await ensureTableColumn(
    "test_drives",
    "vehicle_label",
    "vehicle_label VARCHAR(200) DEFAULT NULL AFTER vehicle_slug",
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      telefone VARCHAR(60) DEFAULT '',
      assunto VARCHAR(160) NOT NULL,
      mensagem TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trade_in_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      marca VARCHAR(120) NOT NULL,
      modelo VARCHAR(120) NOT NULL,
      ano INT NOT NULL,
      quilometragem INT NOT NULL,
      estado_geral VARCHAR(60) NOT NULL,
      nome VARCHAR(150) NOT NULL,
      telefone VARCHAR(60) NOT NULL,
      email VARCHAR(150) NOT NULL,
      observacoes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `);

  await ensureTableColumn(
    "trade_in_requests",
    "is_viewed",
    "is_viewed TINYINT(1) NOT NULL DEFAULT 0",
  );

  await pool.query(`
    CREATE TABLE IF NOT EXISTS finance_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(150) NOT NULL,
      email VARCHAR(150) NOT NULL,
      telefone VARCHAR(60) NOT NULL,
      viatura VARCHAR(200) DEFAULT NULL,
      preco DECIMAL(12, 2) NOT NULL,
      entrada DECIMAL(12, 2) NOT NULL,
      meses INT NOT NULL,
      taxa DECIMAL(5, 2) NOT NULL,
      prestacao_mensal DECIMAL(12, 2) NOT NULL,
      montante_total DECIMAL(12, 2) NOT NULL,
      taeg DECIMAL(5, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
