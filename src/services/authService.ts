import axios from "axios";
import dotenv from "dotenv";
import { getConfiguredToken } from "../utils/config";

dotenv.config();

// Remova o cache por enquanto
// let accessToken: string | null = null;

export async function getAccessToken(): Promise<string> {
  const personalToken = getConfiguredToken();

  const payload = {
    grant_type: "personal",
    personal_token: personalToken,
  };

  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(
      `${process.env.EGESTOR_API_URL}/oauth/access_token`,
      payload,
      { headers }
    );

    const accessToken = response.data.access_token;

    if (!accessToken) {
      throw new Error("Token de acesso não foi retornado pela API");
    }

    return accessToken;
  } catch (error: any) {
    console.error(
      "[Erro ao obter token]",
      error.response?.data || error.message
    );
    throw new Error("Falha ao autenticar com o eGestor");
  }
}
