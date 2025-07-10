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

    const produtosTratados = [];

    for (const item of produtosDaVenda) {
      const codProduto = item.codProduto?.toString();

      if (!codProduto) {
        throw new Error("Produto sem código (codProduto ausente)");
      }

      let remoto;

      try {
        const { data } = await axiosInstance.get(
          `${process.env.EGESTOR_API_URL}/v1/produtos?filtro=${codProduto}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        remoto = data?.data?.[0];

        if (!remoto || remoto.codigo.toString() !== codProduto) {
          throw new Error(`Produto ${codProduto} não encontrado via filtro`);
        }

        console.log(
          `[DEBUG] Produto ${codProduto} encontrado: ${remoto.descricao}`
        );
      } catch (err) {
        console.warn(
          `[ERRO] Produto não encontrado ou erro na API: ${codProduto}`
        );
        throw new Error(`Produto não encontrado no eGestor: ${codProduto}`);
      }

      if (item.quant > remoto.estoque) {
        throw new Error(
          `Estoque insuficiente para o produto ${remoto.descricao} (ID ${remoto.codigo})`
        );
      }

      produtosTratados.push({
        codProduto: remoto.codigo,
        quant: item.quant || 1,
        preco: item.preco || remoto.precoVenda || 1,
        vDesc: 0,
        deducao: 0,
        obs: item.obs || "",
      });
    }

    vendaPayload.produtos = produtosTratados;

    console.log("Payload montado:");
    console.log(JSON.stringify(vendaPayload, null, 2));

    console.log("Payload produtosTratados:");
    console.log(JSON.stringify(produtosTratados, null, 2));

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
    salvarFallback("venda", vendaPayload);

    return res.status(error?.response?.status || 500).json({
      mensagem: "Erro ao criar venda ou gerar NFC-e",
      detalhes: error?.response?.data || error.message,
    });
  }
}
