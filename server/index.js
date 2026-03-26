import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/vehicles", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM vehicles ORDER BY inserted_at DESC, id DESC",
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar viaturas:", error.message);
    res.status(500).json({ message: "Erro ao buscar viaturas." });
  }
});

app.post("/api/test-drives", async (req, res) => {
  try {
    const {
      vehicleSlug,
      dataPreferida,
      horaPreferida,
      nome,
      telefone,
      email,
    } = req.body;

    if (
      !vehicleSlug ||
      !dataPreferida ||
      !horaPreferida ||
      !nome ||
      !telefone ||
      !email
    ) {
      return res.status(400).json({ message: "Campos em falta." });
    }

    await pool.query(
      `INSERT INTO test_drives (vehicle_slug, data_preferida, hora_preferida, nome, telefone, email)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [vehicleSlug, dataPreferida, horaPreferida, nome, telefone, email],
    );

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Erro ao guardar teste drive:", error.message);
    return res.status(500).json({ message: "Erro ao guardar teste drive." });
  }
});

app.listen(port, () => {
  console.log(`API ligada na porta ${port}`);
});
