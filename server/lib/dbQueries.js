import { pool } from "../db.js";

export async function fetchRows(query, params = []) {
  const [rows] = await pool.query(query, params);
  return rows;
}

export async function fetchFirstRow(query, params = []) {
  const rows = await fetchRows(query, params);
  return rows[0] ?? null;
}

export function buildOrderedTableQuery(tableName, columns = "*") {
  return `
    SELECT ${columns}
    FROM ${tableName}
    ORDER BY created_at DESC, id DESC
  `;
}
