import express from "express";
import atualizarToken from "../controllers/tokenController";

const router = express.Router();

router.post("/config/token", atualizarToken);

export default router;
