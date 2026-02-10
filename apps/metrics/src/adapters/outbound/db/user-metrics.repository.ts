import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserMetricsEntity } from "./user-metrics.entity";
import type {
  UserMetricsRepositoryPort,
  UserMetricsRecord,
} from "../../../application/ports/user-metrics.repository.port";

@Injectable()
export class UserMetricsRepository implements UserMetricsRepositoryPort {
  constructor(
    @InjectRepository(UserMetricsEntity)
    private readonly repo: Repository<UserMetricsEntity>,
  ) {}

  async findByUser(user: string): Promise<UserMetricsRecord | null> {
    const row = await this.repo.findOne({ where: { userAddress: user } });
    if (!row) return null;
    return {
      user: row.userAddress,
      volumeUsd: row.volumeUsd,
      feesUsd: row.feesUsd,
      realizedPnlUsd: row.realizedPnlUsd,
      txHash: row.txHash,
    };
  }

  async upsert(record: UserMetricsRecord): Promise<void> {
    await this.repo.save({
      userAddress: record.user,
      volumeUsd: record.volumeUsd,
      feesUsd: record.feesUsd,
      realizedPnlUsd: record.realizedPnlUsd,
      txHash: record.txHash,
    });
  }
}
