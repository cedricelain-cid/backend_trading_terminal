export const KafkaTopics = {
  tradesExecutedV1: "trading.trades.executed.v1",
  portfolioUpdatedV1: "portfolio.balances.updated.v1",
} as const;

export type KafkaTopic = (typeof KafkaTopics)[keyof typeof KafkaTopics];
