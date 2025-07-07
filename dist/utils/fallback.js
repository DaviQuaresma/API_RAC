"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.salvarFallback = salvarFallback;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logsDir = path_1.default.resolve(process.cwd(), "logs");
function salvarFallback(tipo, data) {
    try {
        if (!fs_1.default.existsSync(logsDir)) {
            console.log("⚙ Criando pasta logs...");
            fs_1.default.mkdirSync(logsDir, { recursive: true });
        }
        const fallbackPath = path_1.default.resolve(logsDir, `fallback-${tipo}.json`);
        const fallbackAtual = fs_1.default.existsSync(fallbackPath)
            ? JSON.parse(fs_1.default.readFileSync(fallbackPath, "utf-8"))
            : [];
        fallbackAtual.push(data);
        fs_1.default.writeFileSync(fallbackPath, JSON.stringify(fallbackAtual, null, 2));
        console.log(`💾 Fallback salvo (${tipo}): ${JSON.stringify(data)}`);
    }
    catch (err) {
        console.error(`[ERRO ao salvar fallback - ${tipo}]`, err);
    }
}
