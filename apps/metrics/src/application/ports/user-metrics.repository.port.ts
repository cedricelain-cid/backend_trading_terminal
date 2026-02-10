export type UserMetricsRecord = {
  user: string;
  volumeUsd: number;
  feesUsd: number;
  realizedPnlUsd: number;
  txHash: string;
};

export interface UserMetricsRepositoryPort {
  findByUser(user: string): Promise<UserMetricsRecord | null>;
  upsert(record: UserMetricsRecord): Promise<void>;
}
