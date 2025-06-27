import { Request, Response } from "express";
import axios from "axios";
import { getAccessToken } from "../services/authService";
import { Product } from "../models/Product";

export async function listarProdutos(req: Request, res: Response) {
  try {
    console.log("[.env token]", process.env.EGESTOR_PERSONAL_TOKEN); 

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

export async function criarProduto(req: Request, res: Response) {
  try {
    const token = await getAccessToken();
    const novoProduto: Product = req.body;

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
      error.response?.data || error.message
    );
    res.status(error?.response?.status || 500).json({
      error: "Erro ao criar produto no eGestor",
      details: error?.response?.data || null,
    });
  }
}
