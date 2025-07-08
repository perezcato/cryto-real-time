import { AssetData } from "./types";

export const initialAssetData: AssetData = {
  btc: {
    name: "Bitcoin",
    price: 0,
    prevPrice: 0,
    change: 0,
    direction: "none",
  },
  eth: {
    name: "Ethereum",
    price: 0,
    prevPrice: 0,
    change: 0,
    direction: "none",
  },
  usdt: {
    name: "Tether",
    price: 0,
    prevPrice: 0,
    change: 0,
    direction: "none",
  },
};
