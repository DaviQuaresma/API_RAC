import express from "express";
import validarToken from "../controllers/validacaoController";

const router = express.Router();

router.get("/validar-token", validarToken);

export default router;
