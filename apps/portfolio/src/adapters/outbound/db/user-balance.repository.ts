import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserBalanceEntity } from "./user-balance.entity";
import type {
  UserBalanceRepositoryPort,
  UserBalanceRecord,
} from "../../../application/ports/user-balance.repository.port";

@Injectable()
export class UserBalanceRepository implements UserBalanceRepositoryPort {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly repo: Repository<UserBalanceEntity>,
  ) {}

  async upsert(record: UserBalanceRecord): Promise<void> {
    await this.repo.upsert(
      {
        userAddress: record.user,
        chainId: record.chainId,
        token: record.token,
        balance: record.balance,
        symbol: record.symbol ?? null,
        decimals: record.decimals ?? null,
      },
      ["userAddress", "chainId", "token"],
    );
  }

  async findByUser(user: string): Promise<UserBalanceRecord[]> {
    const rows = await this.repo.find({ where: { userAddress: user } });
    return rows.map((r) => ({
      user: r.userAddress,
      chainId: r.chainId,
      token: r.token,
      balance: r.balance,
      symbol: r.symbol,
      decimals: r.decimals,
    }));
  }
}
