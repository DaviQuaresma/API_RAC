"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validarToken;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../utils/config");
dotenv_1.default.config();
async function validarToken(req, res) {
    const personalToken = (0, config_1.getConfiguredToken)();
    try {
        const response = await axios_1.default.post(`${process.env.EGESTOR_API_URL}/oauth/access_token`, {
            grant_type: "personal",
            personal_token: personalToken,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        res.status(200).json({
            mensagem: "Token válido",
            token: response.data.access_token,
            expires_in: response.data.expires_in,
        });
    }
    catch (error) {
        res.status(error?.response?.status || 500).json({
            mensagem: "Erro ao validar token",
            detalhes: error?.response?.data || error.message,
        });
    }
}
