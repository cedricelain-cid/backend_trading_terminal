import { Injectable, OnModuleInit } from "@nestjs/common";
import { KafkaClient } from "./kafka.client";
import {
  KafkaTopics,
  TradeExecutedV1Schema,
  type TradeExecutedV1,
} from "@tb/shared";
import type { TradePublisherPort } from "../../../application/ports/trade-publisher.port";
import { ensureTopics } from "./topic-admin";

@Injectable()
export class KafkaTradePublisher implements TradePublisherPort, OnModuleInit {
  constructor(private readonly kafka: KafkaClient) {}

  async onModuleInit() {
    await ensureTopics(this.kafka.getKafka(), [KafkaTopics.tradesExecutedV1]);
  }

  async publishTrade(evt: TradeExecutedV1): Promise<void> {
    const parsed = TradeExecutedV1Schema.parse(evt);
    await this.kafka.send(KafkaTopics.tradesExecutedV1, parsed.user, parsed);
  }
}
