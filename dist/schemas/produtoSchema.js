"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoSchema = void 0;
const zod_1 = require("zod");
exports.ProdutoSchema = zod_1.z.object({
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
