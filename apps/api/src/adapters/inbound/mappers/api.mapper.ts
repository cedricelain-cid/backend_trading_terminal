import type { MetricsDto } from "../dto/metrics.dto";
import type { BalanceDto } from "../dto/balance.dto";

export function toMetricsDto(
  user: string,
  data: { volumeUsd: number; feesUsd: number; realizedPnlUsd: number } | null,
): MetricsDto {
  return {
    user,
    volumeUsd: data?.volumeUsd ?? 0,
    feesUsd: data?.feesUsd ?? 0,
    realizedPnlUsd: data?.realizedPnlUsd ?? 0,
  };
}

export function toBalanceDtos(
  rows: Array<{
    user: string;
    chainId: number;
    token: string;
    balance: string;
    symbol?: string | null;
    decimals?: number | null;
  }>,
): BalanceDto[] {
  return rows.map((r) => ({
    user: r.user,
    chainId: r.chainId,
    token: r.token,
    balance: r.balance,
    symbol: r.symbol ?? null,
    decimals: r.decimals ?? null,
  }));
}
