export type Asset = "btc" | "eth" | "sol";

export type AssetData = {
  [key in Asset]: {
    name: string;
    price: number;
    prevPrice: number;
    change: number;
    direction: string;
  };
};

export type AssetResponse = {
  time: string;
  asset: Asset;
  price: number;
};