import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import path from "node:path";

import { KafkaClient } from "./adapters/outbound/kafka/kafka.client";
import { KafkaTradePublisher } from "./adapters/outbound/kafka/kafka-trade.publisher";
import { PriceOracleCoingecko } from "./adapters/outbound/pricing/coingecko.oracle";
import { DetectAndPublishTradeUseCase } from "./application/usecases/detect-and-publish-trade.usecase";
import type { TradePublisherPort } from "./application/ports/trade-publisher.port";
import type { PriceOraclePort } from "./application/ports/price-oracle.port";
import { EvmIndexerStub } from "./adapters/inbound/evm/indexer.stub";

const envFilePath = path.resolve(process.cwd(), "../../.env");

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, envFilePath })],
  providers: [
    EvmIndexerStub,
    KafkaClient,
    KafkaTradePublisher,
    PriceOracleCoingecko,
    {
      provide: "TradePublisherPort",
      useExisting: KafkaTradePublisher,
    },
    {
      provide: "PriceOraclePort",
      useExisting: PriceOracleCoingecko,
    },
    {
      provide: DetectAndPublishTradeUseCase,
      useFactory: (pub: TradePublisherPort, prices: PriceOraclePort) =>
        new DetectAndPublishTradeUseCase(pub, prices),
      inject: ["TradePublisherPort", "PriceOraclePort"],
    },
  ],
})
export class AppModule {}
