import { z } from "zod";

export const FeeLegSchema = z.object({
  token: z.string(),
  amount: z.string(),
  recipient: z.string(),
});

export const TradeExecutedV1Schema = z.object({
  eventType: z.literal("TradeExecuted"),
  version: z.literal("v1"),
  chainId: z.number(),
  txHash: z.string(),
  logIndex: z.number().int(),
  blockNumber: z.number().int(),
  timestamp: z.number().int(),

  user: z.string(),
  venue: z.string().optional(),

  tokenIn: z.string(),
  amountIn: z.string(),
  tokenOut: z.string(),
  amountOut: z.string(),

  fees: z.array(FeeLegSchema).default([]),

  pricing: z
    .object({
      notionalUsd: z.number().optional(),
      feeUsd: z.number().optional(),
      source: z.string().default("inline"),
    })
    .default({ source: "inline" }),

  status: z.enum(["OBSERVED", "FINALIZED", "REVERTED"]).default("OBSERVED"),
});

export type TradeExecutedV1 = z.infer<typeof TradeExecutedV1Schema>;
