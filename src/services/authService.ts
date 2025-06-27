import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let accessToken: string | null = null;

export async function getAccessToken(): Promise<string> {
  if (accessToken !== null) return accessToken;

  const payload = {
    grant_type: "personal",
    personal_token: process.env.EGESTOR_PERSONAL_TOKEN,
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

    accessToken = response.data.access_token;

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
