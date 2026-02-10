import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "node:path";

import { MetricsController } from "./adapters/inbound/http/metrics.controller";
import { PortfolioController } from "./adapters/inbound/http/portfolio.controller";
import { Gateway } from "./adapters/inbound/ws/gateway";
import { KafkaRealtimeBridge } from "./adapters/inbound/kafka/kafka-realtime.bridge";

import { UserMetricsEntity } from "./adapters/outbound/db/user-metrics.entity";
import { UserBalanceEntity } from "./adapters/outbound/db/user-balance.entity";
import { MetricsReadTypeOrmAdapter } from "./adapters/outbound/db/metrics-read.typeorm.adapter";
import { PortfolioReadTypeOrmAdapter } from "./adapters/outbound/db/portfolio-read.typeorm.adapter";

import type { MetricsReadPort } from "./application/ports/metrics-read.port";
import type { PortfolioReadPort } from "./application/ports/portfolio-read.port";
import { MetricsQuery } from "./application/queries/metrics.query";
import { PortfolioQuery } from "./application/queries/portfolio.query";

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
      entities: [UserMetricsEntity, UserBalanceEntity],
      synchronize: false,
      migrationsRun: false,
    }),
    TypeOrmModule.forFeature([UserMetricsEntity, UserBalanceEntity]),
  ],
  controllers: [MetricsController, PortfolioController],
  providers: [
    Gateway,
    KafkaRealtimeBridge,

    MetricsReadTypeOrmAdapter,
    PortfolioReadTypeOrmAdapter,

    { provide: "MetricsReadPort", useExisting: MetricsReadTypeOrmAdapter },
    { provide: "PortfolioReadPort", useExisting: PortfolioReadTypeOrmAdapter },

    {
      provide: MetricsQuery,
      useFactory: (port: MetricsReadPort) => new MetricsQuery(port),
      inject: ["MetricsReadPort"],
    },
    {
      provide: PortfolioQuery,
      useFactory: (port: PortfolioReadPort) => new PortfolioQuery(port),
      inject: ["PortfolioReadPort"],
    },
  ],
})
export class AppModule {}
