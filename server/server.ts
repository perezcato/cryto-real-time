import WebSocket from "ws";

import { AssetResponse, SimplifiedData } from "./types";
import { ASSETS, BINANCE_API_URL, BROADCAST_INTERVAL, PORT, RECONNECT_DELAY } from "./config";
import { BinanceTickerSchema } from "./validation";



let latestPrices: { [asset: string]: SimplifiedData } = {};

const wss = new WebSocket.Server({ port: PORT as number });
console.log(`✅ WebSocket server started`);

wss.on("connection", (ws: WebSocket) => {
  console.log("🚀 A new client connected.");
  ws.on("close", () => console.log("👋 A client disconnected."));
  ws.on("error", (error) => console.error("Client WebSocket error:", error));
});


const connectToBinance = () => {

  const streams = ASSETS.map((asset) => `${asset}usdt@ticker`).join("/");
  const streamUrl = `${BINANCE_API_URL}/${streams}`;
  const binanceSocket = new WebSocket(streamUrl);

  binanceSocket.on("open", () => {
    console.log("✅ Successfully connected to Binance API.");
    console.log(`Subscribed to prices for ${ASSETS.join(", ")}.`);
  });

  binanceSocket.on("message", (data: WebSocket.Data) => {
    try {
      handleMessage(data);
    } catch (error) {
      console.error("Error processing message from Binance:", error);
    }
  });

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

const handleMessage = (data: WebSocket.Data) => {
  const message = JSON.parse(data.toString()) as AssetResponse;
  const validationResult = BinanceTickerSchema.safeParse(message);
  if (!validationResult.success) {
      return;
  }
  const validatedData = validationResult.data;
  const asset = validatedData.s.replace("USDT", "").toLowerCase();

  if (!ASSETS.includes(asset)) {
    return;
  }

  latestPrices[asset] = {
    asset: asset,
    price: parseFloat(validatedData.c),
    time: new Date(validatedData.E).toISOString(),
};
};

//Send the latest data to the clients every 2 seconds
setInterval(() => {
  if (Object.keys(latestPrices).length === 0) {
      return; 
  }
  for (const asset in latestPrices) {
      broadcastToClients(JSON.stringify(latestPrices[asset]));
  }
}, BROADCAST_INTERVAL);

const broadcastToClients = (message: string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

connectToBinance();
