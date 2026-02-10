import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserMetricsEntity } from "./user-metrics.entity";
import type { MetricsReadPort } from "../../../application/ports/metrics-read.port";

@Injectable()
export class MetricsReadTypeOrmAdapter implements MetricsReadPort {
  constructor(
    @InjectRepository(UserMetricsEntity)
    private readonly repo: Repository<UserMetricsEntity>,
  ) {}

  async findByUser(user: string) {
    const row = await this.repo.findOne({ where: { userAddress: user } });
    if (!row) return null;
    return {
      user: row.userAddress,
      volumeUsd: row.volumeUsd,
      feesUsd: row.feesUsd,
      realizedPnlUsd: row.realizedPnlUsd,
    };
  }
}
