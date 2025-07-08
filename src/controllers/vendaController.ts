import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { getAccessToken } from "../services/authService";
import axiosInstance from "../services/axiosInstance";
import { salvarFallback } from "../utils/fallback";

dotenv.config();

export async function criarVenda(req: Request, res: Response): Promise<any> {
  const vendaPayload = req.body;
  const produtosDaVenda = vendaPayload?.produtos || [];

  try {
    const token = await getAccessToken();

    if (!vendaPayload.codContato || !produtosDaVenda.length) {
      return res.status(400).json({
        mensagem: "Dados obrigatórios faltando (codContato ou produtos)",
      });
    }

    // 1. Buscar todos os produtos do eGestor
    const { data } = await axiosInstance.get(
      `${process.env.EGESTOR_API_URL}/v1/produtos?limit=1000`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Compatibiliza formato de resposta
    let produtosRemotos: any[] = [];

    if (Array.isArray(data)) {
      produtosRemotos = data;
    } else if (Array.isArray(data?.data)) {
      produtosRemotos = data.data;
    } else if (Array.isArray(data?.itens)) {
      produtosRemotos = data.itens;
    } else {
      throw new Error("Formato inesperado de resposta da API de produtos.");
    }

    console.log("[DEBUG] Total de produtos remotos:", produtosRemotos.length);

    // 2. Validação dos produtos enviados
    const produtosTratados = produtosDaVenda.map((item: any) => {
      const remoto = produtosRemotos.find(
        (p: any) =>
          p.codigoProprio?.toString() === item.codProprio?.toString() ||
          p.codigo?.toString() === item.codProduto?.toString()
      );

      if (!remoto) {
        throw new Error(
          `Produto não encontrado no eGestor: ${item.codProduto}`
        );
      }

      if (item.quant > remoto.estoque) {
        throw new Error(
          `Estoque insuficiente para o produto ${remoto.descricao} (ID ${item.codProduto})`
        );
      }

      return {
        codProduto: remoto.codigo,
        quant: item.quant || 1,
        preco: item.preco || remoto.precoVenda || 1,
        vDesc: 0,
        deducao: 0,
        obs: item.obs || "",
      };
    });

    vendaPayload.produtos = produtosTratados;

    // 3. Criar a venda
    const vendaResponse = await axios.post(
      `${process.env.EGESTOR_API_URL}/v1/vendas`,
      vendaPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const codigoVenda = vendaResponse.data.codigo;

    // 4. Gerar NFC-e
    const nfceResponse = await axios.post(
      `${process.env.EGESTOR_API_URL}/v1/vendas/${codigoVenda}/gerarNfce`,
      {
        cpfcnpj: vendaPayload?.cpfcnpj || 12345678912,
        indPres: vendaPayload?.indPres || 1,
        codTransportadora: vendaPayload?.codTransportadora || 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      mensagem: "Venda e NFC-e geradas com sucesso",
      codigoVenda,
      notaFiscal: nfceResponse.data,
    });
  } catch (error: any) {
    console.error("[Erro criarVenda]", error?.response?.data || error.message);

    // Salvar fallback local para recuperar venda
    salvarFallback("venda", vendaPayload);

    return res.status(error?.response?.status || 500).json({
      mensagem: "Erro ao criar venda ou gerar NFC-e",
      detalhes: error?.response?.data || error.message,
    });
  }
}
