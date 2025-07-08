import React from "react";
import { AssetData } from "@/types";
import { PriceDirectionArrow } from "./priceDirection";

type CryptoCardProps = {
  name: string;
  data: AssetData[keyof AssetData];
};

export const CryptoCard = React.memo(({ name, data }: CryptoCardProps) => {
  const { price, change, direction } = data;
  const isInitialState = price === 0;
  
  const priceColor =
    direction === "up"
      ? "text-green-400"
      : direction === "down"
      ? "text-red-400"
      : "text-gray-300";

  const changeColor =
    change > 0
      ? "text-green-500"
      : change < 0
      ? "text-red-500"
      : "text-gray-400";

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

  const formattedChange = `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-700/50 transition-all duration-300 hover:border-gray-600 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">{name}/USD</h2>
        <PriceDirectionArrow direction={direction} />
      </div>
      <div className="mb-4 h-12 flex items-center">
        <p
          className={`text-4xl font-mono transition-colors duration-300 ${priceColor}`}
        >
          {isInitialState ? "..." : formattedPrice}
        </p>
      </div>
      <div className="h-10">
        <p className={`text-lg font-semibold ${changeColor}`}>
          {isInitialState ? "..." : formattedChange}
        </p>
        <p className="text-sm text-gray-400">Real-time Prices</p>
      </div>
    </div>
  );
});
CryptoCard.displayName = "CryptoCard";
