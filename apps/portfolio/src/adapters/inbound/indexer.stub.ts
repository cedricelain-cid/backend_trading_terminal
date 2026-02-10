import { Injectable, OnModuleInit } from "@nestjs/common";
import { UpsertAndPublishPortfolioUseCase } from "../../application/usecases/upsert-and-publish-portfolio.usecase";

@Injectable()
export class PortfolioIndexerStub implements OnModuleInit {
  constructor(private readonly uc: UpsertAndPublishPortfolioUseCase) {}

  async onModuleInit() {
    let i = 0;
    setInterval(async () => {
      i += 1;
      const now = Math.floor(Date.now() / 1000);
      await this.uc.handle({
        eventType: "PortfolioUpdated",
        version: "v1",
        user: "0xUserStub",
        chainId: Number(process.env.CHAIN_ID || 56),
        timestamp: now,
        balances: [
          {
            token: "0xTokenIn",
            balance: String(1000 + i),
            decimals: 18,
            symbol: "TIN",
          },
          {
            token: "0xTokenOut",
            balance: String(2000 + 2 * i),
            decimals: 18,
            symbol: "TOUT",
          },
        ],
        source: "stub",
      });
      console.log("[portfolio] published stub portfolio", i);
    }, 3000);
  }
}
