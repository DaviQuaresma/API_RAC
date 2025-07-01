import axios from "axios";
import dotenv from "dotenv";
import { getConfiguredToken } from "../utils/config";

dotenv.config();

let cachedToken: string | null = null;
let expiresAt: number | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Se o token ainda é válido, retorna o cache
  if (cachedToken && expiresAt && now < expiresAt) {
    return cachedToken;
  }

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

    const { access_token, expires_in } = response.data;

    if (!access_token) {
      throw new Error("Token de acesso não foi retornado pela API");
    }

    // Salva token e tempo de expiração (com margem de segurança de 5s)
    cachedToken = access_token;
    expiresAt = now + expires_in * 1000 - 5000;

    return cachedToken!;
  } catch (error: any) {
    console.error(
      "[Erro ao obter token]",
      error.response?.data || error.message
    );
    throw new Error("Falha ao autenticar com o eGestor");
  }
}
