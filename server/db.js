import "dotenv/config";
import mysql from "mysql2/promise";
import { getRequiredEnv, getRequiredNumberEnv } from "./lib/env.js";

export const pool = mysql.createPool({
  host: getRequiredEnv("DB_HOST"),
  port: getRequiredNumberEnv("DB_PORT"),
  user: getRequiredEnv("DB_USER"),
  password: getRequiredEnv("DB_PASSWORD"),
  database: getRequiredEnv("DB_NAME"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
