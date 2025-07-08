import WebSocket from "ws";
import dotenv from "dotenv";
import { AssetResponse } from "./types";

dotenv.config();

const PORT = process.env.PORT || 8080;
const COINMETRICS_API_URL =
  "wss://api.coinmetrics.io/v4/timeseries-stream/asset-metrics";
const ASSETS = ["btc", "eth", "usdt"];
const METRICS = ["ReferenceRateUSD"];
const FREQUENCY = "1s";
const RECONNECT_DELAY = 5000; 

const API_KEY = process.env.COINMETRICS_API_KEY;

if (!API_KEY) {
  console.error(
    "FATAL ERROR: COINMETRICS_API_KEY is not defined in the .env file."
  );
  process.exit(1);
}

const wss = new WebSocket.Server({ port: PORT as number });
console.log(`✅ WebSocket server started`);

wss.on("connection", (ws: WebSocket) => {
  console.log("🚀 A new client connected.");
  ws.on("close", () => console.log("👋 A client disconnected."));
  ws.on("error", (error) => console.error("Client WebSocket error:", error));
});

const connectToCoinMetrics = () => {
  console.log("Attempting to connect to CoinMetrics API...");

  const url = `${COINMETRICS_API_URL}?api_key=${API_KEY}&assets=${ASSETS.join(
    ", "
  )}&frequency=${FREQUENCY}&metrics=${METRICS}`;

  console.log("URL", url);

  const coinmetricsSocket = new WebSocket(url);

  coinmetricsSocket.on("open", () => {
    console.log("✅ Successfully connected to CoinMetrics API.");
    console.log(`Subscribed to prices for ${ASSETS.join(", ")}.`);
  });

  coinmetricsSocket.on("message", (data: WebSocket.Data) => {
    try {
      handleCoinMetricsMessage(data);
    } catch (error) {
      console.error("Error processing message from CoinMetrics:", error);
    }
  });

  coinmetricsSocket.on("close", () => {
    console.log(
      `CoinMetrics connection closed. Reconnecting in ${
        RECONNECT_DELAY / 1000
      } seconds...`
    );
    setTimeout(connectToCoinMetrics, RECONNECT_DELAY);
  });

  coinmetricsSocket.on("error", (error) => {
    console.error("CoinMetrics WebSocket error:", error.message);
    coinmetricsSocket.close();
  });
};

const handleCoinMetricsMessage = (data: WebSocket.Data) => {
  const message = JSON.parse(data.toString()) as AssetResponse;

  const simplifiedData = {
    asset: message.asset,
    price: parseFloat(`${message.ReferenceRateUSD}`).toFixed(2),
    time: message.time,
  };

  broadcastToClients(JSON.stringify(simplifiedData));
};

const broadcastToClients = (message: string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

connectToCoinMetrics();
