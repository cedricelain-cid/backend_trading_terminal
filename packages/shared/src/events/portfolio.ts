import { z } from "zod";

export const TokenBalanceSchema = z.object({
  token: z.string(),
  balance: z.string(),
  decimals: z.number().int().optional(),
  symbol: z.string().optional(),
});

export const PortfolioUpdatedV1Schema = z.object({
  eventType: z.literal("PortfolioUpdated"),
  version: z.literal("v1"),
  user: z.string(),
  chainId: z.number(),
  timestamp: z.number().int(),
  balances: z.array(TokenBalanceSchema),
  source: z.string().default("stub"),
});

export type PortfolioUpdatedV1 = z.infer<typeof PortfolioUpdatedV1Schema>;
