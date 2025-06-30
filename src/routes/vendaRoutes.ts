import express from "express";
import { criarVenda } from "../controllers/vendaController";

const router = express.Router();

router.post("/venda", criarVenda);

export default router;
