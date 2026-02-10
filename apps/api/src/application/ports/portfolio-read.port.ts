export interface PortfolioReadPort {
  findBalancesByUser(user: string): Promise<
    Array<{
      user: string;
      chainId: number;
      token: string;
      balance: string;
      symbol?: string | null;
      decimals?: number | null;
    }>
  >;
}
