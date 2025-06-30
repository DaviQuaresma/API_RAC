import { Request, Response } from "express";
import axios from "axios";
import { getAccessToken } from "../services/authService";
import { z } from "zod";

const ProdutoSchema = z.object({
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

export async function listarProdutos(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const token = await getAccessToken();

    const params = new URLSearchParams(
      req.query as Record<string, string>
    ).toString();

    const response = await axios.get(
      `${process.env.EGESTOR_API_URL}/v1/produtos?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      "[Erro ao listar produtos]",
      error.response?.data || error.message
    );
    res.status(error?.response?.status || 500).json({
      error: "Erro ao buscar produtos no eGestor",
      details: error?.response?.data || null,
    });
  }
}

export async function criarProduto(req: Request, res: Response): Promise<any> {
  try {
    const token = await getAccessToken();

    const valid = ProdutoSchema.safeParse(req.body);
    if (!valid.success) {
      return res
        .status(400)
        .json({ error: "Payload inválido", detalhes: valid.error.format() });
    }

    const novoProduto = valid.data;

    const response = await axios.post(
      `${process.env.EGESTOR_API_URL}/v1/produtos`,
      novoProduto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json(response.data);
  } catch (error: any) {
    console.error(
      "[Erro ao criar produto]",
      error?.response?.data || error?.message || error
    );
    res.status(error?.response?.status || 500).json({
      error: "Erro ao criar produto no eGestor",
      details: error?.response?.data || null,
    });
  }
}

export async function atualizarProduto(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const token = await getAccessToken();

    const { codigo, ...produtoAlvo } = req.body;

    if (!codigo) {
      return res.status(400).json({ error: "Código do produto é obrigatório" });
    }

    const response = await axios.put(
      `${process.env.EGESTOR_API_URL}/v1/produtos/${codigo}`,
      produtoAlvo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error: any) {
    console.error(
      "[Erro ao atualizar produto]",
      error.response?.data || error.message
    );
    res.status(error?.response?.status || 500).json({
      error: "Erro ao atualizar produto no eGestor",
      details: error?.response?.data || null,
    });
  }
}
