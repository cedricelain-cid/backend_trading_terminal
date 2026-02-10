import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { Kafka, Partitioners } from "kafkajs";

@Injectable()
export class KafkaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaClient.name);
  private kafka = new Kafka({
    clientId: "portfolio",
    brokers: [process.env.KAFKA_BROKERS ?? "localhost:29092"]
  });
  producer = this.kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log("Kafka producer connected");
  }
  async onModuleDestroy() {
    await this.producer.disconnect();
  }
  getKafka() {
    return this.kafka;
  }
  async send(topic: string, key: string, payload: unknown) {
    const value = JSON.stringify(payload);
    await this.producer.send({ topic, messages: [{ key, value }] });
  }
}
