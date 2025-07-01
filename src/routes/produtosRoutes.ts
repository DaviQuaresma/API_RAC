import express from "express";
import {
  listarProdutos,
  atualizarProduto,
  criarProduto,
} from "../controllers/produtosController";

const router = express.Router();

router.get("/produtos", listarProdutos);
router.post("/produtos", criarProduto);
router.put("/produtos/:codigo", atualizarProduto);

export default router;
