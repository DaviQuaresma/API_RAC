"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProdutos = listarProdutos;
exports.criarProduto = criarProduto;
exports.atualizarProduto = atualizarProduto;
const authService_1 = require("../services/authService");
const axiosInstance_1 = __importDefault(require("../services/axiosInstance"));
const fallback_1 = require("../utils/fallback");
const produtoSchema_1 = require("../schemas/produtoSchema");
async function listarProdutos(req, res) {
    try {
        const token = await (0, authService_1.getAccessToken)();
        const query = new URLSearchParams({
            limit: "1000",
            ...req.query,
        }).toString();
        const { data } = await axiosInstance_1.default.get(`${process.env.EGESTOR_API_URL}/v1/produtos?${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const produtos = data?.data || data || [];
        return res.status(200).json(produtos);
    }
    catch (error) {
        console.error("[Erro ao listar produtos]", error.response?.data || error.message);
        return res.status(error?.response?.status || 500).json({
            error: "Erro ao buscar produtos no eGestor",
            details: error?.response?.data || null,
        });
    }
}
async function criarProduto(req, res) {
    try {
        const token = await (0, authService_1.getAccessToken)();
        const valid = produtoSchema_1.ProdutoSchema.safeParse(req.body);
        if (!valid.success) {
            return res.status(400).json({
                error: "Payload inválido",
                detalhes: valid.error.format(),
            });
        }
        const novoProduto = valid.data;
        const { data } = await axiosInstance_1.default.post(`${process.env.EGESTOR_API_URL}/v1/produtos`, novoProduto, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res.status(201).json(data);
    }
    catch (error) {
        console.error("[Erro ao criar produto]", error.response?.data || error.message);
        (0, fallback_1.salvarFallback)(req.body);
        return res.status(error?.response?.status || 500).json({
            error: "Erro ao criar produto no eGestor",
            details: error?.response?.data || null,
        });
    }
}
async function atualizarProduto(req, res) {
    try {
        const token = await (0, authService_1.getAccessToken)();
        const codigo = req.params.codigo;
        if (!codigo) {
            return res.status(400).json({ error: "Código do produto é obrigatório" });
        }
        const { codigo: _, ...produtoAlvo } = req.body;
        const { data } = await axiosInstance_1.default.put(`${process.env.EGESTOR_API_URL}/v1/produtos/${codigo}`, produtoAlvo, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return res.status(200).json(data);
    }
    catch (error) {
        console.error("[Erro ao atualizar produto]", error.response?.data || error.message);
        (0, fallback_1.salvarFallback)(req.body);
        return res.status(error?.response?.status || 500).json({
            error: "Erro ao atualizar produto no eGestor",
            details: error?.response?.data || null,
        });
    }
}
