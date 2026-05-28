import express from "express";
import { fetchRows } from "../lib/consultasBaseDados.js";
import { VEHICLE_SELECT_ORDER_QUERY } from "../lib/dadosFormularioViatura.js";
import { sendServerError } from "../lib/respostasHttp.js";

const router = express.Router();

router.get("/vehicles", async (_req, res) => {
  try {
    return res.json(await fetchRows(VEHICLE_SELECT_ORDER_QUERY));
  } catch (error) {
    return sendServerError(
      res,
      "Erro ao buscar viaturas",
      "Erro ao buscar viaturas.",
      error,
    );
  }
});

export default router;
