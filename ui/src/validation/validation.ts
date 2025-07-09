import { z } from "zod";

export const BinanceTickerSchemaUI = z.object({
  price: z.number(),
  time: z.string(),
  asset: z.string(),
});
