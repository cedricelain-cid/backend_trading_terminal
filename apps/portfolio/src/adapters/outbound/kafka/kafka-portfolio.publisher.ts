import { Injectable, OnModuleInit } from "@nestjs/common";
import { KafkaClient } from "./kafka.client";
import {
  KafkaTopics,
  PortfolioUpdatedV1Schema,
  type PortfolioUpdatedV1,
} from "@tb/shared";
import type { PortfolioPublisherPort } from "../../../application/ports/portfolio-publisher.port";
import { ensureTopics } from "./topic-admin";

@Injectable()
export class KafkaPortfolioPublisher
  implements PortfolioPublisherPort, OnModuleInit
{
  constructor(private readonly kafka: KafkaClient) {}

  async onModuleInit() {
    await ensureTopics(this.kafka.getKafka(), [KafkaTopics.portfolioUpdatedV1]);
  }

  async publish(evt: PortfolioUpdatedV1): Promise<void> {
    const parsed = PortfolioUpdatedV1Schema.parse(evt);
    await this.kafka.send(KafkaTopics.portfolioUpdatedV1, parsed.user, parsed);
  }
}
