import type { TradeExecutedV1 } from "@tb/shared";

export interface TradePublisherPort {
  publishTrade(evt: TradeExecutedV1): Promise<void>;
}
