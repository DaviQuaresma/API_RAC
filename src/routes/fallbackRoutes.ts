import express from "express";
import { processarFallback } from "../jobs/processarFallback";

const router = express.Router();

router.post("/fallback/processar", async (req, res) => {
  try {
    await processarFallback();
    res.status(200).json({ message: "Fallback processado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao processar fallback", details: err });
  }
});

export default router;
