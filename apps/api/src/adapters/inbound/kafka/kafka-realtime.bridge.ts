import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Kafka } from "kafkajs";
import {
  KafkaTopics,
  PortfolioUpdatedV1Schema,
  PortfolioUpdatedV1,
} from "@tb/shared";
import { Gateway } from "../ws/gateway";
import { ensureTopics } from "../../outbound/kafka/topic-admin";

@Injectable()
export class KafkaRealtimeBridge implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaRealtimeBridge.name);
  private kafka = new Kafka({
    clientId: "api",
    brokers: [process.env.KAFKA_BROKERS ?? "localhost:29092"],
  });
  private consumer = this.kafka.consumer({ groupId: "api-realtime" });

  constructor(private readonly gateway: Gateway) {}

  async onModuleInit() {
    await ensureTopics(this.kafka, [KafkaTopics.portfolioUpdatedV1]);
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: KafkaTopics.portfolioUpdatedV1,
      fromBeginning: true,
    });
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        try {
          const parsed: PortfolioUpdatedV1 = PortfolioUpdatedV1Schema.parse(
            JSON.parse(message.value.toString()),
          );
          this.gateway.emitUser(parsed.user, parsed.eventType, parsed);
        } catch (error) {
          this.logger.error("Error parsing PortfolioUpdatedV1", error);
        }
      },
    });
    this.logger.log("KafkaRealtimeBridge started");
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}
