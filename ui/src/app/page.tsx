"use client";

import { useCallback, useState } from "react";
import { AssetData, AssetResponse } from "@/types";
import { initialAssetData } from "@/data/initial-data";
import { usePriceWebSocket } from "@/hooks/usePriceWebsocket.hook";
import { StatusIndicator } from "@/components/statusIndicator";
import { CryptoCard } from "@/components/cryptoCard";

// Main application component for real-time cryptocurrency price tracking
export default function Home() {
  // State to store current prices and price change data for all tracked assets
  const [prices, setPrices] = useState<AssetData>(initialAssetData);

  // Callback to process incoming WebSocket price updates
  // Calculates price changes and determines price direction for UI feedback
  const handleMessage = useCallback((data: AssetResponse) => {
    if (data.asset && prices.hasOwnProperty(data.asset)) {
      setPrices((prevPrices) => {
        const assetKey = data.asset;
        const assetData = prevPrices[assetKey];
        const newPrice = data.price;

        // Use previous price as baseline, or current price if first update
        const baselinePrice =
          assetData.prevPrice === 0 ? newPrice : assetData.prevPrice;

        // Calculate percentage change from baseline
        const change =
          baselinePrice === 0
            ? 0
            : ((newPrice - baselinePrice) / baselinePrice) * 100;

        // Determine price direction for visual feedback (up/down/stable)
        const direction =
          newPrice > assetData.price
            ? "up"
            : newPrice < assetData.price
            ? "down"
            : 'none';

        return {
          ...prevPrices,
          [assetKey]: {
            ...assetData,
            price: newPrice,
            prevPrice: baselinePrice,
            direction,
            change,
          },
        };
      });
    }
  }, []);

  // Connect to WebSocket server for real-time price updates
  const status = usePriceWebSocket({
    onMessage: handleMessage,
    url: process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080",
  });

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Crypto Price Tracker
            </h1>
          </div>
          <StatusIndicator status={status} />
        </header>

        {/* Grid layout for cryptocurrency price cards */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(prices).map(([key, value]) => (
            <CryptoCard key={key} name={value.name} data={value} />
          ))}
        </main>

        <footer className="text-center mt-12 text-gray-500">
          <p>Data is relayed in real-time from a Node.js server.</p>
        </footer>
      </div>
    </div>
  );
}
