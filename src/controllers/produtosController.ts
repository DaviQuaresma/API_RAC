import { Request, Response } from "express";
import { getAccessToken } from "../services/authService";
import axiosInstance from "../services/axiosInstance";
import { salvarFallback } from "../utils/fallback";
import { ProdutoSchema } from "../schemas/produtoSchema";
import { URLSearchParams } from "url";

export async function listarProdutos(
  req: Request,
  res: Response
): Promise<any> {
  try {
    const token = await getAccessToken();
    const limit = 50;
    let page = 1;
    let todosProdutos: any[] = [];

    while (true) {
      const query = new URLSearchParams({
        limit: limit.toString(),
        page: page.toString(),
        ...(req.query as Record<string, string>),
      }).toString();

      const { data } = await axiosInstance.get(
        `${process.env.EGESTOR_API_URL}/v1/produtos?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const lote = data?.data || [];
      todosProdutos = todosProdutos.concat(lote);

      // Verifica se já chegou na última página
      if (data.current_page >= data.last_page) break;

      page += 1;
    }

    return res.status(200).json(todosProdutos);
  } catch (error: any) {
    console.error(
      "[Erro ao listar produtos]",
      error.response?.data || error.message
    );
    return res.status(error?.response?.status || 500).json({
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
      return res.status(400).json({
        error: "Payload inválido",
        detalhes: valid.error.format(),
      });
    }

    const novoProduto = valid.data;

    const { data } = await axiosInstance.post(
      `${process.env.EGESTOR_API_URL}/v1/produtos`,
      novoProduto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(201).json(data);
  } catch (error: any) {
    console.error(
      "[Erro ao criar produto]",
      error.response?.data || error.message
    );
    salvarFallback("produto", req.body);
    return res.status(error?.response?.status || 500).json({
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
    const codigo = req.params.codigo;

    if (!codigo) {
      return res.status(400).json({ error: "Código do produto é obrigatório" });
    }

    const { codigo: _, ...produtoAlvo } = req.body;

    const { data } = await axiosInstance.put(
      `${process.env.EGESTOR_API_URL}/v1/produtos/${codigo}`,
      produtoAlvo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json(data);
  } catch (error: any) {
    console.error(
      "[Erro ao atualizar produto]",
      error.response?.data || error.message
    );
    salvarFallback("produto", req.body);
    return res.status(error?.response?.status || 500).json({
      error: "Erro ao atualizar produto no eGestor",
      details: error?.response?.data || null,
    });
  }
}
