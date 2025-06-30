import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { getConfiguredToken } from "../utils/config";

dotenv.config();

export default async function validarToken(
  req: Request,
  res: Response
): Promise<void> {
  const personalToken = getConfiguredToken();

  try {
    const response = await axios.post(
      `${process.env.EGESTOR_API_URL}/oauth/access_token`,
      {
        grant_type: "personal",
        personal_token: personalToken,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      mensagem: "Token válido",
      token: response.data.access_token,
      expires_in: response.data.expires_in,
    });
  } catch (error: any) {
    res.status(error?.response?.status || 500).json({
      mensagem: "Erro ao validar token",
      detalhes: error?.response?.data || error.message,
    });
  }
}
