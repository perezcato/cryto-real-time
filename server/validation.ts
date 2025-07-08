import { z } from "zod";

export const BinanceTickerSchema = z.object({
    e: z.literal("24hrTicker"), 
    s: z.string(),              
    c: z.string(),              
    E: z.number(),            
  });