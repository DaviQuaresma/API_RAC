"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarVenda = criarVenda;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const authService_1 = require("../services/authService");
const axiosInstance_1 = __importDefault(require("../services/axiosInstance"));
const fallback_1 = require("../utils/fallback");
dotenv_1.default.config();
async function criarVenda(req, res) {
    const vendaPayload = req.body;
    const produtosDaVenda = vendaPayload?.produtos || [];
    try {
        const token = await (0, authService_1.getAccessToken)();
        if (!vendaPayload.codContato || !produtosDaVenda.length) {
            return res.status(400).json({
                mensagem: "Dados obrigatórios faltando (codContato ou produtos)",
            });
        }
        // 1. Valida produtos e estoque antes de criar a venda
        const { data } = await axiosInstance_1.default.get(`${process.env.EGESTOR_API_URL}/v1/produtos?limit=1000`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("[DEBUG] Resposta de /v1/produtos:", data[0]);
        const produtosRemotos = Array.isArray(data.data)
            ? data.data
            : Array.isArray(data)
                ? data
                : [];
        if (!produtosRemotos.length) {
            throw new Error("Não foi possível obter a lista de produtos do eGestor");
        }
        if (!Array.isArray(produtosRemotos)) {
            throw new Error("Formato inválido de resposta da API: produtos não é um array");
        }
        for (const item of produtosDaVenda) {
            const remoto = produtosRemotos.find((p) => p.codigo === item.codProduto);
            if (!remoto) {
                return res.status(404).json({
                    mensagem: `Produto não encontrado no eGestor: ${item.codProduto}`,
                });
            }
            if (item.quant > remoto.estoque) {
                return res.status(400).json({
                    mensagem: `Estoque insuficiente no eGestor para o produto ${remoto.descricao} (ID ${item.codProduto})`,
                });
            }
        }
        // 2. Cria a venda
        const vendaResponse = await axios_1.default.post(`${process.env.EGESTOR_API_URL}/v1/vendas`, vendaPayload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const codigoVenda = vendaResponse.data.codigo;
        // 3. Gera a NFC-e
        const nfceResponse = await axios_1.default.post(`${process.env.EGESTOR_API_URL}/v1/vendas/${codigoVenda}/gerarNfce`, {
            cpfcnpj: vendaPayload?.cpfcnpj || 12345678912,
            indPres: vendaPayload?.indPres || 1,
            codTransportadora: vendaPayload?.codTransportadora || 0,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res.status(200).json({
            mensagem: "Venda e NFC-e geradas com sucesso",
            codigoVenda,
            notaFiscal: nfceResponse.data,
        });
    }
    catch (error) {
        console.error("[Erro criarVenda]", error?.response?.data || error.message);
        // Fallback da venda
        (0, fallback_1.salvarFallback)("venda", vendaPayload);
        return res.status(error?.response?.status || 500).json({
            mensagem: "Erro ao criar venda ou gerar NFC-e",
            detalhes: error?.response?.data || error.message,
        });
    }
}
