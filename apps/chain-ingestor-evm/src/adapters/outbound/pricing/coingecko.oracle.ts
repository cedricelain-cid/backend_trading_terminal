import { Injectable } from "@nestjs/common";
import type { PriceOraclePort } from "../../../application/ports/price-oracle.port";

/**
 * Scaffold oracle: returns deterministic pseudo-prices (no external HTTP).
 * Replace with a real provider (CoinGecko, CoinMarketCap, on-chain DEX TWAP, etc.) in production.
 */
@Injectable()
export class PriceOracleCoingecko implements PriceOraclePort {
  async getUsdPrice(tokenAddress: string, chainId: number): Promise<number> {
    // Deterministic stable-ish price for demo: based on address hash and chainId.
    const seed = (tokenAddress.toLowerCase().slice(2, 10) + String(chainId))
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    return 0.5 + (seed % 2000) / 1000; // 0.5 .. 2.499
  }
}
