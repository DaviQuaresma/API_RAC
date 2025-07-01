"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produtosController_1 = require("../controllers/produtosController");
const router = express_1.default.Router();
router.get("/produtos", produtosController_1.listarProdutos);
router.post("/produtos", produtosController_1.criarProduto);
router.put("/produtos/:codigo", produtosController_1.atualizarProduto);
exports.default = router;
