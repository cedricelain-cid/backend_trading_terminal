import type { PortfolioUpdatedV1 } from "@tb/shared";
import type { UserBalanceRepositoryPort } from "../ports/user-balance.repository.port";
import type { PortfolioPublisherPort } from "../ports/portfolio-publisher.port";

/**
 * Upserts balances and publishes a PortfolioUpdated event for real-time consumers.
 */
export class UpsertAndPublishPortfolioUseCase {
  constructor(
    private readonly repo: UserBalanceRepositoryPort,
    private readonly publisher: PortfolioPublisherPort,
  ) {}

  async handle(evt: PortfolioUpdatedV1): Promise<void> {
    for (const b of evt.balances) {
      await this.repo.upsert({
        user: evt.user,
        chainId: evt.chainId,
        token: b.token,
        balance: b.balance,
        symbol: b.symbol ?? null,
        decimals: b.decimals ?? null,
      });
    }
    await this.publisher.publish(evt);
  }
}
