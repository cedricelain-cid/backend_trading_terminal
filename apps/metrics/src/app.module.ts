import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "node:path";

import { KafkaConsumerRunner } from "./adapters/inbound/kafka/kafka-consumer.runner";
import { UserMetricsEntity } from "./adapters/outbound/db/user-metrics.entity";
import { UserMetricsRepository } from "./adapters/outbound/db/user-metrics.repository";
import { MetricsProjectorUseCase } from "./application/usecases/metrics-projector.usecase";
import { CreateMetricsTables1700000000001 } from "./adapters/outbound/db/migrations/1700000000001-CreateMetricsTables";
import type { UserMetricsRepositoryPort } from "./application/ports/user-metrics.repository.port";

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
      entities: [UserMetricsEntity],
      migrations: [CreateMetricsTables1700000000001],
      synchronize: false,
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([UserMetricsEntity]),
  ],
  providers: [
    KafkaConsumerRunner,
    UserMetricsRepository,
    {
      provide: "UserMetricsRepositoryPort",
      useExisting: UserMetricsRepository,
    },
    {
      provide: MetricsProjectorUseCase,
      useFactory: (repo: UserMetricsRepositoryPort) =>
        new MetricsProjectorUseCase(repo),
      inject: ["UserMetricsRepositoryPort"],
    },
  ],
})
export class AppModule {}
