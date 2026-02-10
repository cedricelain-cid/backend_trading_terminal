export interface MetricsReadPort {
  findByUser(user: string): Promise<{
    user: string;
    volumeUsd: number;
    feesUsd: number;
    realizedPnlUsd: number;
  } | null>;
}
