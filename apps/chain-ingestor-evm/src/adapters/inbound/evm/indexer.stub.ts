import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  DetectAndPublishTradeUseCase,
  type DetectedTrade,
} from "../../../application/usecases/detect-and-publish-trade.usecase";

@Injectable()
export class EvmIndexerStub implements OnModuleInit {
  constructor(private readonly uc: DetectAndPublishTradeUseCase) {}

  async onModuleInit() {
    let i = 0;
    setInterval(async () => {
      i += 1;
      const now = Math.floor(Date.now() / 1000);
      const t: DetectedTrade = {
        user: "0xUserStub",
        chainId: Number(process.env.CHAIN_ID || 56),
        txHash: "0xTxHashStub" + i,
        logIndex: i,
        blockNumber: 1_000_000 + i,
        tokenIn: "0xTokenIn",
        tokenOut: "0xTokenOut",
        amountIn: String(10 + i),
        amountOut: String(5 + i),
        timestamp: now,
      };
      await this.uc.handle(t);
      console.log("[chain-ingestor-evm] published stub trade", i);
    }, 3000);
  }
}
