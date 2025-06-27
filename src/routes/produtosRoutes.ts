import express from "express";
import { listarProdutos, criarProduto } from "../controllers/produtosController";

const router = express.Router();

router.get("/produtos", listarProdutos);
router.post("/produtos", criarProduto);

export default router;
