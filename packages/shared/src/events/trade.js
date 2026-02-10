"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeExecutedV1Schema = exports.FeeLegSchema = void 0;
const zod_1 = require("zod");
exports.FeeLegSchema = zod_1.z.object({
  token: zod_1.z.string(),
  amount: zod_1.z.string(),
  recipient: zod_1.z.string(),
});
exports.TradeExecutedV1Schema = zod_1.z.object({
  eventType: zod_1.z.literal("TradeExecuted"),
  version: zod_1.z.literal("v1"),
  chainId: zod_1.z.number(),
  txHash: zod_1.z.string(),
  logIndex: zod_1.z.number().int(),
  blockNumber: zod_1.z.number().int(),
  timestamp: zod_1.z.number().int(),
  user: zod_1.z.string(),
  venue: zod_1.z.string().optional(),
  tokenIn: zod_1.z.string(),
  amountIn: zod_1.z.string(),
  tokenOut: zod_1.z.string(),
  amountOut: zod_1.z.string(),
  fees: zod_1.z.array(exports.FeeLegSchema).default([]),
  pricing: zod_1.z
    .object({
      notionalUsd: zod_1.z.number().optional(),
      feeUsd: zod_1.z.number().optional(),
      source: zod_1.z.string().default("inline"),
    })
    .default({ source: "inline" }),
  status: zod_1.z
    .enum(["OBSERVED", "FINALIZED", "REVERTED"])
    .default("OBSERVED"),
});
