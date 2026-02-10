import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "node:path";

import { PortfolioIndexerStub } from "./adapters/inbound/indexer.stub";
import { UserBalanceEntity } from "./adapters/outbound/db/user-balance.entity";
import { UserBalanceRepository } from "./adapters/outbound/db/user-balance.repository";
import { KafkaClient } from "./adapters/outbound/kafka/kafka.client";
import { KafkaPortfolioPublisher } from "./adapters/outbound/kafka/kafka-portfolio.publisher";
import { UpsertAndPublishPortfolioUseCase } from "./application/usecases/upsert-and-publish-portfolio.usecase";
import type { UserBalanceRepositoryPort } from "./application/ports/user-balance.repository.port";
import type { PortfolioPublisherPort } from "./application/ports/portfolio-publisher.port";
import { CreatePortfolioTables1700000000002 } from "./adapters/outbound/db/migrations/1700000000002-CreatePortfolioTables";

const envFilePath = path.resolve(process.cwd(), "../../.env");

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.POSTGRES_HOST ?? "localhost",
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? "trading",
      password: process.env.POSTGRES_PASSWORD ?? "trading",
      database: process.env.POSTGRES_DB ?? "trading",
      entities: [UserBalanceEntity],
      migrations: [CreatePortfolioTables1700000000002],
      synchronize: false,
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([UserBalanceEntity]),
  ],
  providers: [
    PortfolioIndexerStub,
    KafkaClient,
    KafkaPortfolioPublisher,
    UserBalanceRepository,
    {
      provide: "UserBalanceRepositoryPort",
      useExisting: UserBalanceRepository,
    },
    {
      provide: "PortfolioPublisherPort",
      useExisting: KafkaPortfolioPublisher,
    },
    {
      provide: UpsertAndPublishPortfolioUseCase,
      useFactory: (
        repo: UserBalanceRepositoryPort,
        pub: PortfolioPublisherPort,
      ) => new UpsertAndPublishPortfolioUseCase(repo, pub),
      inject: ["UserBalanceRepositoryPort", "PortfolioPublisherPort"],
    },
  ],
})
export class AppModule {}
