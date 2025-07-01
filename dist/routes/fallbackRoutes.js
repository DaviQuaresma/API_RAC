"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const processarFallback_1 = require("../jobs/processarFallback");
const router = express_1.default.Router();
router.post("/fallback/processar", async (req, res) => {
    try {
        await (0, processarFallback_1.processarFallback)();
        res.status(200).json({ message: "Fallback processado com sucesso" });
    }
    catch (err) {
        res.status(500).json({ error: "Erro ao processar fallback", details: err });
    }
});
exports.default = router;
