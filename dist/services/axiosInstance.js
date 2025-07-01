"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const axiosInstance = axios_1.default.create();
(0, axios_retry_1.default)(axiosInstance, {
    retries: 3,
    retryDelay: axios_retry_1.default.exponentialDelay,
    retryCondition: (error) => {
        return (axios_retry_1.default.isNetworkOrIdempotentRequestError(error) ||
            error.response?.status === 429 ||
            error.response?.status === 503);
    },
});
exports.default = axiosInstance;
