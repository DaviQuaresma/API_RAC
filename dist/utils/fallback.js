"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salvarFallback = salvarFallback;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logsDir = path_1.default.resolve(process.cwd(), "logs");
const fallbackPath = path_1.default.resolve(logsDir, "fallback.json");
function salvarFallback(produto) {
    try {
        if (!fs_1.default.existsSync(logsDir)) {
            console.log("⚙ Criando pasta logs...");
            fs_1.default.mkdirSync(logsDir, { recursive: true });
        }
        const fallbackAtual = fs_1.default.existsSync(fallbackPath)
            ? JSON.parse(fs_1.default.readFileSync(fallbackPath, "utf-8"))
            : [];
        fallbackAtual.push(produto);
        fs_1.default.writeFileSync(fallbackPath, JSON.stringify(fallbackAtual, null, 2));
        console.log(`📦 Produto salvo no fallback: ${produto.codigoProprio || produto.codigo || "sem código"}`);
    }
    catch (err) {
        console.error("[ERRO ao salvar fallback]", err);
    }
}
