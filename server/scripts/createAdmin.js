import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../db.js";
import { ensureAuthTables } from "../lib/bootstrap.js";
import { fetchFirstRow } from "../lib/dbQueries.js";

const [, , username, password] = process.argv;

async function createAdmin() {
  if (!username || !password) {
    throw new Error("Uso: npm run create-admin -- <username> <password>");
  }

  if (password.length < 6) {
    throw new Error("A password do admin deve ter pelo menos 6 caracteres.");
  }

  await ensureAuthTables();

  const passwordHash = await bcrypt.hash(password, 10);
  const existingAdmin = await fetchFirstRow(
    "SELECT id FROM admins WHERE username = ? LIMIT 1",
    [username],
  );

  if (existingAdmin) {
    await pool.query(
      "UPDATE admins SET password_hash = ? WHERE username = ?",
      [passwordHash, username],
    );
    console.log(`Admin "${username}" atualizado com sucesso.`);
    return;
  }

  await pool.query(
    "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
    [username, passwordHash],
  );
  console.log(`Admin "${username}" criado com sucesso.`);
}

createAdmin()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });

