import type { PortfolioReadPort } from "../ports/portfolio-read.port";
export class PortfolioQuery {
  constructor(private readonly portfolioRead: PortfolioReadPort) {}
  getBalances(user: string) {
    return this.portfolioRead.findBalancesByUser(user);
  }
}
