import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { getAccessToken } from "../services/authService";

dotenv.config();

export async function criarVenda(req: Request, res: Response): Promise<any> {
  try {
    const token = await getAccessToken();

    const vendaPayload = req.body;

    console.log("📦 Payload recebido:", JSON.stringify(req.body, null, 2));

    // Validação mínima
    if (!vendaPayload.codContato || !vendaPayload.produtos?.length) {
      return res.status(400).json({
        mensagem: "Dados obrigatórios faltando (codContato ou produtos)",
      });
    }

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

    // Gerar NFC-e automaticamente
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

    res.status(200).json({
      mensagem: "Venda e NFC-e geradas com sucesso",
      codigoVenda,
      notaFiscal: nfceResponse.data,
    });
  } catch (error: any) {
    console.error("[Erro criarVenda]", error?.response?.data || error.message);
    res.status(error?.response?.status || 500).json({
      mensagem: "Erro ao criar venda ou gerar NFC-e",
      detalhes: error?.response?.data || error.message,
    });
  }
}
