import type { TradeExecutedV1 } from "@tb/shared";
import type { TradePublisherPort } from "../ports/trade-publisher.port";
import type { PriceOraclePort } from "../ports/price-oracle.port";

export type DetectedTrade = {
  user: string;
  chainId: number;
  txHash: string;
  logIndex: number;
  blockNumber: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  timestamp: number;
  venue?: string;
  fees?: Array<{
    token: string;
    amount: string;
    recipient: string;
  }>;
  status?: "OBSERVED" | "FINALIZED" | "REVERTED";
};

/**
 * Application layer: pure.
 * Takes a detected trade (from an EVM indexer adapter),
 * enriches it (pricing), and publishes a canonical TradeExecuted event.
 */
export class DetectAndPublishTradeUseCase {
  constructor(
    private readonly publisher: TradePublisherPort,
    private readonly prices: PriceOraclePort,
  ) {}

  async handle(t: DetectedTrade): Promise<void> {
    const tokenOutUsd = await this.prices.getUsdPrice(t.tokenOut, t.chainId);
    // Scaffold simplification: treat amountOut as "units" and compute volumeUsd linearly.
    const amountOutNum = Number(t.amountOut);
    const notionalUsd = Number.isFinite(amountOutNum)
      ? amountOutNum * tokenOutUsd
      : 0;

    const evt: TradeExecutedV1 = {
      eventType: "TradeExecuted",
      version: "v1",
      user: t.user,
      chainId: t.chainId,
      txHash: t.txHash,
      logIndex: t.logIndex,
      blockNumber: t.blockNumber,
      tokenIn: t.tokenIn,
      tokenOut: t.tokenOut,
      amountIn: t.amountIn,
      amountOut: t.amountOut,
      timestamp: t.timestamp,
      venue: t.venue,
      fees: t.fees ?? [],
      pricing: {
        notionalUsd,
        feeUsd: 0,
        source: "coingecko_stub",
      },
      status: t.status ?? "OBSERVED",
    };

    await this.publisher.publishTrade(evt);
  }
}
