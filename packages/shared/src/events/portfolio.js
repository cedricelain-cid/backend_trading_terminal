"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioUpdatedV1Schema = exports.TokenBalanceSchema = void 0;
const zod_1 = require("zod");
exports.TokenBalanceSchema = zod_1.z.object({
  token: zod_1.z.string(),
  balance: zod_1.z.string(),
  decimals: zod_1.z.number().int().optional(),
  symbol: zod_1.z.string().optional(),
});
exports.PortfolioUpdatedV1Schema = zod_1.z.object({
  eventType: zod_1.z.literal("PortfolioUpdated"),
  version: zod_1.z.literal("v1"),
  user: zod_1.z.string(),
  chainId: zod_1.z.number(),
  timestamp: zod_1.z.number().int(),
  balances: zod_1.z.array(exports.TokenBalanceSchema),
  source: zod_1.z.string().default("stub"),
});
