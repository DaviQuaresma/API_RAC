"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = getAccessToken;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let accessToken = null;
async function getAccessToken() {
    if (accessToken !== null)
        return accessToken;
    const payload = {
        grant_type: "personal",
        personal_token: process.env.EGESTOR_PERSONAL_TOKEN,
    };
    const headers = {
        "Content-Type": "application/json",
    };
    try {
        const response = await axios_1.default.post(`${process.env.EGESTOR_API_URL}/oauth/access_token`, payload, { headers });
        accessToken = response.data.access_token;
        console.log("[TOKEN OBTIDO]", accessToken);
        if (!accessToken) {
            throw new Error("Token de acesso não foi retornado pela API");
        }
        return accessToken;
    }
    catch (error) {
        console.error("[Erro ao obter token]", error.response?.data || error.message);
        throw new Error("Falha ao autenticar com o eGestor");
    }
}
