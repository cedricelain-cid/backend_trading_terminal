import { TradeExecutedV1 } from "@tb/shared";
import type { UserMetricsRepositoryPort } from "../ports/user-metrics.repository.port";

/**
 * Consumes TradeExecuted events and updates the Metrics.
 */
export class MetricsProjectorUseCase {
  constructor(private readonly repo: UserMetricsRepositoryPort) {}

  async onTrade(evt: TradeExecutedV1): Promise<void> {

    const current = await this.repo.findByUser(evt.user);
    if(current?.txHash && current.txHash === evt.txHash) {
      return;
    }
    const next = {
      user: evt.user,
      volumeUsd: (current?.volumeUsd ?? 0) + (evt.pricing.notionalUsd ?? 0),
      feesUsd: (current?.feesUsd ?? 0) + (evt.pricing.feeUsd ?? 0),
      realizedPnlUsd: current?.realizedPnlUsd ?? 0,
      txHash: evt.txHash,
    };

    await this.repo.upsert(next);
  }
}
