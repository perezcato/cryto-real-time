import WebSocket from "ws";

import { AssetResponse, SimplifiedData } from "./types";
import { ASSETS, BINANCE_API_URL, BROADCAST_INTERVAL, PORT, RECONNECT_DELAY } from "./config";
import { BinanceTickerSchema } from "./validation";

// Store latest price data for each tracked asset
let latestPrices: { [asset: string]: SimplifiedData } = {};

// Initialize WebSocket server for client connections
const wss = new WebSocket.Server({ port: PORT as number });
console.log(`✅ WebSocket server started`);

// Handle client connections and disconnections
wss.on("connection", (ws: WebSocket) => {
  console.log("🚀 A new client connected.");
  ws.on("close", () => console.log("👋 A client disconnected."));
  ws.on("error", (error) => console.error("Client WebSocket error:", error));
});

// Connect to Binance WebSocket API to receive real-time price updates
const connectToBinance = () => {

  // Create stream subscription for all tracked assets (e.g., "btcusdt@ticker/ethusdt@ticker")
  const streams = ASSETS.map((asset) => `${asset}usdt@ticker`).join("/");
  const streamUrl = `${BINANCE_API_URL}/${streams}`;
  const binanceSocket = new WebSocket(streamUrl);

  binanceSocket.on("open", () => {
    console.log("✅ Successfully connected to Binance API.");
    console.log(`Subscribed to prices for ${ASSETS.join(", ")}.`);
  });

  // Process incoming price data from Binance
  binanceSocket.on("message", (data: WebSocket.Data) => {
    try {
      handleMessage(data);
    } catch (error) {
      console.error("Error processing message from Binance:", error);
    }
  });

  // Auto-reconnect on connection loss
  binanceSocket.on("close", () => {
    console.log(
      `Binance connection closed. Reconnecting in ${
        RECONNECT_DELAY / 1000
      } seconds...`
    );
    setTimeout(connectToBinance, RECONNECT_DELAY);
  });

  binanceSocket.on("error", (error) => {
    console.error("Binance WebSocket error:", error.message);
    binanceSocket.close();
  });
};

// Validate and process incoming price data from Binance
const handleMessage = (data: WebSocket.Data) => {
  const message = JSON.parse(data.toString()) as AssetResponse;
  
  // Validate data structure using Zod schema
  const validationResult = BinanceTickerSchema.safeParse(message);
  if (!validationResult.success) {
      return;
  }
  const validatedData = validationResult.data;
  
  // Extract asset name from symbol (e.g., "BTCUSDT" -> "btc")
  const asset = validatedData.s.replace("USDT", "").toLowerCase();

  // Only process data for tracked assets
  if (!ASSETS.includes(asset)) {
    return;
  }

  // Store latest price data
  latestPrices[asset] = {
    asset: asset,
    price: parseFloat(validatedData.c), // Current price
    time: new Date(validatedData.E).toISOString(), // Event time
};
};

// Broadcast latest prices to all connected clients at regular intervals
setInterval(() => {
  if (Object.keys(latestPrices).length === 0) {
      return; // Don't broadcast if no price data available
  }
  for (const asset in latestPrices) {
      broadcastToClients(JSON.stringify(latestPrices[asset]));
  }
}, BROADCAST_INTERVAL);

// Send message to all connected WebSocket clients
const broadcastToClients = (message: string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Start the Binance connection
connectToBinance();
