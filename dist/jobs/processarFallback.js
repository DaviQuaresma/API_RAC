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
const logsDir = path_1.default.join(process.cwd(), "logs");
const fallbackPath = path_1.default.join(logsDir, "fallback.json");
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
async function processarFallback() {
    console.log("[Fallback] Iniciando processamento do fallback.json");
    if (!fs_1.default.existsSync(fallbackPath)) {
        console.log("[Fallback] Nenhum fallback pendente.");
        return;
    }
    let fallbackData = [];
    try {
        const raw = fs_1.default.readFileSync(fallbackPath, "utf-8");
        fallbackData = JSON.parse(raw);
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
    for (const item of fallbackData) {
        try {
            // 🔍 Heurística simples para saber se é produto ou venda
            const isProduto = produtoSchema_1.ProdutoSchema.safeParse(item).success;
            const isVenda = item?.codContato && item?.produtos?.length;
            if (isProduto) {
                const endpoint = item.codigo
                    ? `${process.env.EGESTOR_API_URL}/v1/produtos/${item.codigo}`
                    : `${process.env.EGESTOR_API_URL}/v1/produtos`;
                const method = item.codigo ? "put" : "post";
                const payload = item.codigo ? { ...item, codigo: undefined } : item;
                const { data } = await axiosInstance_1.default[method](endpoint, payload, {
                    headers,
                });
                console.log(`✅ Produto reprocessado: ${item.codigoProprio} (${data.codigo})`);
            }
            else if (isVenda) {
                const vendaResponse = await axiosInstance_1.default.post(`${process.env.EGESTOR_API_URL}/v1/vendas`, item, { headers });
                const codigoVenda = vendaResponse.data.codigo;
                // Tenta gerar NFC-e após criação
                await axiosInstance_1.default.post(`${process.env.EGESTOR_API_URL}/v1/vendas/${codigoVenda}/gerarNfce`, {
                    cpfcnpj: item?.cpfcnpj || 12345678912,
                    indPres: item?.indPres || 1,
                    codTransportadora: item?.codTransportadora || 0,
                }, { headers });
                console.log(`✅ Venda reprocessada: ${codigoVenda}`);
            }
            else {
                console.warn("[Fallback] Tipo de item não reconhecido:", item);
                novosFallbacks.push(item);
            }
        }
        catch (err) {
            console.error("[Fallback] Falha ao reenviar item:", err?.response?.data || err.message);
            novosFallbacks.push(item); // Mantém para nova tentativa depois
        }
    }
    if (novosFallbacks.length > 0) {
        fs_1.default.writeFileSync(fallbackPath, JSON.stringify(novosFallbacks, null, 2));
        console.log(`[Fallback] ${novosFallbacks.length} itens ainda com erro.`);
    }
    else {
        fs_1.default.unlinkSync(fallbackPath);
        console.log("[Fallback] Todos os itens processados com sucesso. Arquivo removido.");
    }
}
