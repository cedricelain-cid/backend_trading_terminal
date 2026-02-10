export interface PriceOraclePort {
  /** Return USD price for a token at (approximately) now. */
  getUsdPrice(tokenAddress: string, chainId: number): Promise<number>;
}
