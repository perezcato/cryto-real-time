import dotenv from "dotenv";

dotenv.config();


export const PORT = process.env.PORT || 8080;
export const BINANCE_API_URL = "wss://stream.binance.com:9443/ws";
export const ASSETS = ["btc", "eth", "sol"];
export const RECONNECT_DELAY = 5000;
export const BROADCAST_INTERVAL = 2000;