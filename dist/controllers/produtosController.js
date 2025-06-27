"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProdutos = listarProdutos;
exports.criarProduto = criarProduto;
const axios_1 = __importDefault(require("axios"));
const authService_1 = require("../services/authService");
async function listarProdutos(req, res) {
    try {
        console.log("[.env token]", process.env.EGESTOR_PERSONAL_TOKEN);
        const token = await (0, authService_1.getAccessToken)();
        const params = new URLSearchParams(req.query).toString();
        const response = await axios_1.default.get(`${process.env.EGESTOR_API_URL}/v1/produtos?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("[Erro ao listar produtos]", error.response?.data || error.message);
        res.status(error?.response?.status || 500).json({
            error: "Erro ao buscar produtos no eGestor",
            details: error?.response?.data || null,
        });
    }
}
async function criarProduto(req, res) {
    try {
        const token = await (0, authService_1.getAccessToken)();
        const novoProduto = req.body;
        const response = await axios_1.default.post(`${process.env.EGESTOR_API_URL}/v1/produtos`, novoProduto, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        res.status(201).json(response.data);
    }
    catch (error) {
        console.error("[Erro ao criar produto]", error.response?.data || error.message);
        res.status(error?.response?.status || 500).json({
            error: "Erro ao criar produto no eGestor",
            details: error?.response?.data || null,
        });
    }
}
