"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processarFallback = processarFallback;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axiosInstance_1 = __importDefault(require("../services/axiosInstance"));
const authService_1 = require("../services/authService");
const produtoSchema_1 = require("../schemas/produtoSchema");
// Em vez de __dirname, que aponta pro dist/jobs
const logsDir = path_1.default.join(process.cwd(), 'logs');
const fallbackPath = path_1.default.join(logsDir, 'fallback.json');
// Garante que o diretório exista
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
async function processarFallback() {
    console.log("[Fallback] Iniciando processamento do fallback.json");
    if (!fs_1.default.existsSync(fallbackPath)) {
        console.log("[Fallback] Nenhum fallback pendente.");
        return;
    }
    const fallbackRaw = fs_1.default.readFileSync(fallbackPath, "utf-8");
    let fallbackData = [];
    try {
        fallbackData = JSON.parse(fallbackRaw);
    }
    catch (e) {
        console.error("[Fallback] JSON mal formatado:", e);
        return;
    }
    if (!Array.isArray(fallbackData) || fallbackData.length === 0) {
        console.log("[Fallback] Lista vazia, nada a processar.");
        return;
    }
    const token = await (0, authService_1.getAccessToken)();
    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
    const novosFallbacks = [];
    for (const produto of fallbackData) {
        try {
            const valid = produtoSchema_1.ProdutoSchema.safeParse(produto);
            if (!valid.success) {
                console.warn(`[Fallback] Produto inválido ignorado: ${produto.codigoProprio}`);
                continue;
            }
            const endpoint = produto.codigo
                ? `${process.env.EGESTOR_API_URL}/v1/produtos/${produto.codigo}`
                : `${process.env.EGESTOR_API_URL}/v1/produtos`;
            const method = produto.codigo ? "put" : "post";
            const payload = produto.codigo
                ? { ...produto, codigo: undefined }
                : produto;
            const { data } = await axiosInstance_1.default[method](endpoint, payload, {
                headers,
            });
            console.log(` Fallback reprocessado: ${produto.codigoProprio} (${data.codigo})`);
        }
        catch (err) {
            console.error(`[Fallback] Falha ao reenviar ${produto.codigoProprio}:`, err?.response?.data || err.message);
            novosFallbacks.push(produto); // Reinsere para tentar depois
        }
    }
    if (novosFallbacks.length > 0) {
        fs_1.default.writeFileSync(fallbackPath, JSON.stringify(novosFallbacks, null, 2));
        console.log(`[Fallback] ${novosFallbacks.length} produtos ainda com erro.`);
    }
    else {
        fs_1.default.unlinkSync(fallbackPath);
        console.log("[Fallback] Todos os produtos processados com sucesso. Arquivo removido.");
    }
}
