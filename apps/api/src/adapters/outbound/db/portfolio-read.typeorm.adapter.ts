import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserBalanceEntity } from "./user-balance.entity";
import type { PortfolioReadPort } from "../../../application/ports/portfolio-read.port";

@Injectable()
export class PortfolioReadTypeOrmAdapter implements PortfolioReadPort {
  constructor(
    @InjectRepository(UserBalanceEntity)
    private readonly repo: Repository<UserBalanceEntity>,
  ) {}

  async findBalancesByUser(user: string) {
    const rows = await this.repo.find({ where: { userAddress: user } });
    return rows.map((r) => ({
      user: r.userAddress,
      chainId: r.chainId,
      token: r.token,
      balance: r.balance,
      symbol: r.symbol ?? null,
      decimals: r.decimals ?? null,
    }));
  }
}
