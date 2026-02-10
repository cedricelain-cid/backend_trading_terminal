import type { MetricsReadPort } from "../ports/metrics-read.port";
export class MetricsQuery {
  constructor(private readonly metricsRead: MetricsReadPort) {}
  getByUser(user: string) {
    return this.metricsRead.findByUser(user);
  }
}
