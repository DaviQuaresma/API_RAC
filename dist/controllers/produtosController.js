"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarProdutos = listarProdutos;
exports.criarProduto = criarProduto;
exports.atualizarProduto = atualizarProduto;
const axios_1 = __importDefault(require("axios"));
const authService_1 = require("../services/authService");
const zod_1 = require("zod");
const ProdutoSchema = zod_1.z.object({
    descricao: zod_1.z.string(),
    codigoProprio: zod_1.z.string().optional(),
    codCategoria: zod_1.z.number(),
    estoque: zod_1.z.number(),
    estoqueMinimo: zod_1.z.number(),
    controlarEstoque: zod_1.z.boolean(),
    margemLucro: zod_1.z.number(),
    precoCusto: zod_1.z.number(),
    precoVenda: zod_1.z.number(),
    origemFiscal: zod_1.z.number(),
    unidadeTributada: zod_1.z.string(),
    refEanGtin: zod_1.z.string().optional(),
    ncm: zod_1.z.string().optional(),
    codigoCEST: zod_1.z.string().optional(),
    excecaoIPI: zod_1.z.number(),
    codigoGrupoTributos: zod_1.z.number(),
    anotacoesNFE: zod_1.z.string().optional(),
    anotacoesInternas: zod_1.z.string().optional(),
    pesoBruto: zod_1.z.number(),
    pesoLiquido: zod_1.z.number(),
    tags: zod_1.z.array(zod_1.z.string()).optional(),
});
async function listarProdutos(req, res) {
    try {
        const token = await (0, authService_1.getAccessToken)();
        const params = new URLSearchParams(req.query).toString();
        const response = await axios_1.default.get(`${process.env.EGESTOR_API_URL}/v1/produtos?${params}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        // Garanta que você está retornando apenas o array de produtos
        const produtos = response.data?.data || [];
        res.status(200).json(produtos);
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
        const valid = ProdutoSchema.safeParse(req.body);
        if (!valid.success) {
            return res
                .status(400)
                .json({ error: "Payload inválido", detalhes: valid.error.format() });
        }
        const novoProduto = valid.data;
        const response = await axios_1.default.post(`${process.env.EGESTOR_API_URL}/v1/produtos`, novoProduto, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        res.status(201).json(response.data);
    }
    catch (error) {
        console.error("[Erro ao criar produto]", error?.response?.data || error?.message || error);
        res.status(error?.response?.status || 500).json({
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
        // Remove o campo 'codigo' do corpo da requisição
        const { codigo: _, ...produtoAlvo } = req.body;
        console.log(`${process.env.EGESTOR_API_URL}/v1/produtos/${codigo}`);
        console.log("Codigo: ", codigo);
        console.log("ProdutoAlvo: ", produtoAlvo);
        console.log(token);
        const response = await axios_1.default.put(`${process.env.EGESTOR_API_URL}/v1/produtos/${codigo}`, produtoAlvo, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        console.error("[Erro ao atualizar produto]", error.response?.data || error.message);
        res.status(error?.response?.status || 500).json({
            error: "Erro ao atualizar produto no eGestor",
            details: error?.response?.data || null,
        });
    }
}
