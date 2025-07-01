"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../utils/config");
dotenv_1.default.config();
let cachedToken = null;
let expiresAt = null;
async function getAccessToken() {
    const now = Date.now();
    // Se o token ainda é válido, retorna o cache
    if (cachedToken && expiresAt && now < expiresAt) {
        return cachedToken;
    }
    const personalToken = (0, config_1.getConfiguredToken)();
    const payload = {
        grant_type: "personal",
        personal_token: personalToken,
    };
    const headers = {
        "Content-Type": "application/json",
    };
    try {
        const response = await axios_1.default.post(`${process.env.EGESTOR_API_URL}/oauth/access_token`, payload, { headers });
        const { access_token, expires_in } = response.data;
        if (!access_token) {
            throw new Error("Token de acesso não foi retornado pela API");
        }
        // Salva token e tempo de expiração (com margem de segurança de 5s)
        cachedToken = access_token;
        expiresAt = now + expires_in * 1000 - 5000;
        return cachedToken;
    }
    catch (error) {
        console.error("[Erro ao obter token]", error.response?.data || error.message);
        throw new Error("Falha ao autenticar com o eGestor");
    }
}
