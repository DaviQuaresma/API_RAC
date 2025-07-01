"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarVenda = criarVenda;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const authService_1 = require("../services/authService");
dotenv_1.default.config();
async function criarVenda(req, res) {
    try {
        const token = await (0, authService_1.getAccessToken)();
        const vendaPayload = req.body;
        console.log("📦 Payload recebido:", JSON.stringify(req.body, null, 2));
        // Validação mínima
        if (!vendaPayload.codContato || !vendaPayload.produtos?.length) {
            return res.status(400).json({
                mensagem: "Dados obrigatórios faltando (codContato ou produtos)",
            });
        }
        const vendaResponse = await axios_1.default.post(`${process.env.EGESTOR_API_URL}/v1/vendas`, vendaPayload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const codigoVenda = vendaResponse.data.codigo;
        // Gerar NFC-e automaticamente
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
        res.status(200).json({
            mensagem: "Venda e NFC-e geradas com sucesso",
            codigoVenda,
            notaFiscal: nfceResponse.data,
        });
    }
    catch (error) {
        console.error("[Erro criarVenda]", error?.response?.data || error.message);
        res.status(error?.response?.status || 500).json({
            mensagem: "Erro ao criar venda ou gerar NFC-e",
            detalhes: error?.response?.data || error.message,
        });
    }
}
