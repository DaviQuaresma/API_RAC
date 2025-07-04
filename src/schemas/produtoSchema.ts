import { z } from "zod";

export const ProdutoSchema = z.object({
  descricao: z.string(),
  codigoProprio: z.string().optional(),
  codCategoria: z.number(),
  estoque: z.number(),
  estoqueMinimo: z.number(),
  controlarEstoque: z.boolean(),
  margemLucro: z.number(),
  precoCusto: z.number(),
  precoVenda: z.number(),
  origemFiscal: z.number(),
  unidadeTributada: z.string(),
  refEanGtin: z.string().optional(),
  ncm: z.string().optional(),
  codigoCEST: z.string().optional(),
  excecaoIPI: z.number(),
  codigoGrupoTributos: z.number(),
  anotacoesNFE: z.string().optional(),
  anotacoesInternas: z.string().optional(),
  pesoBruto: z.number(),
  pesoLiquido: z.number(),
  tags: z.array(z.string()).optional(),
});