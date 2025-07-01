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
// Remova o cache por enquanto
// let accessToken: string | null = null;
async function getAccessToken() {
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
        const accessToken = response.data.access_token;
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
