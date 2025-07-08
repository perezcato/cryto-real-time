export type AssetResponse = {
    time: string,
    asset: "usdt" | "btc" | "eth",
    ReferenceRateUSD: number,
    cm_sequence_id: number
}