import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Kafka, logLevel } from "kafkajs";
import { KafkaTopics, TradeExecutedV1, TradeExecutedV1Schema } from "@tb/shared";
import { MetricsProjectorUseCase } from "../../../application/usecases/metrics-projector.usecase";
import { ensureTopics } from "../../outbound/kafka/topic-admin";

@Injectable()
export class KafkaConsumerRunner implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerRunner.name);
  private kafka = new Kafka({
    clientId: "metrics",
    brokers: [process.env.KAFKA_BROKERS ?? "localhost:29092"],
    logLevel: logLevel.NOTHING,
  });
  private consumer = this.kafka.consumer({ groupId: "metrics-projector" });

  constructor(private readonly projector: MetricsProjectorUseCase) {}

  async onModuleInit() {
    await ensureTopics(this.kafka, [KafkaTopics.tradesExecutedV1]);
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KafkaTopics.tradesExecutedV1,
      fromBeginning: true,
    });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        try {
        const parsed: TradeExecutedV1 = TradeExecutedV1Schema.parse(
            JSON.parse(message.value.toString()),
          );
          await this.projector.onTrade(parsed);
        } catch (error) {
          this.logger.error("Error parsing TradeExecutedV1", error);
        }
      },
    });
    this.logger.log("KafkaConsumerRunner started");
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
