import { AssetResponse } from "@/types";
import { BinanceTickerSchemaUI } from "@/validation/validation";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from 'zod'

interface UsePriceWebSocketOptions {
  onMessage: (data: AssetResponse) => void;
  url: string;
}

type WebSocketStatus = "Connected" | "Disconnected" | "Connecting...";

export const usePriceWebSocket = ({ onMessage, url }: UsePriceWebSocketOptions) => {
  const [status, setStatus] = useState<WebSocketStatus>("Disconnected");
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log("WebSocket is already connected.");
      return;
    }

    setStatus("Connecting...");
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
      setStatus("Connected");
      reconnectAttempts.current = 0;
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as AssetResponse;
        const validationResult = BinanceTickerSchemaUI.safeParse(data);

        if (!validationResult.success) {
          return;
        }

        const validatedData = validationResult.data;
        onMessage(validatedData as AssetResponse);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected");
      setStatus("Disconnected");

      const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
      console.log(`Attempting to reconnect in ${delay / 1000}s...`);
      reconnectAttempts.current++;
      setTimeout(connect, delay);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
  }, [url, onMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [connect]);

  return status;
};
