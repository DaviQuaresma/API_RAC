"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vendaController_1 = require("../controllers/vendaController");
const router = express_1.default.Router();
router.post("/venda", vendaController_1.criarVenda);
exports.default = router;
