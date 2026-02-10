import type { PortfolioUpdatedV1 } from "@tb/shared";

export interface PortfolioPublisherPort {
  publish(evt: PortfolioUpdatedV1): Promise<void>;
}
