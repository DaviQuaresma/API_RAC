import express from "express";
import { getContact } from "../controllers/contatoController";

const router = express.Router();

router.get("/contatos", getContact);

export default router;
