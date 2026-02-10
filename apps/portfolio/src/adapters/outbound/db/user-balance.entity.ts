import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "user_balances", schema: "portfolio" })
@Index(["userAddress", "chainId", "token"], { unique: true })
export class UserBalanceEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", name: "user_address" })
  userAddress!: string;

  @Column({ type: "int", name: "chain_id" })
  chainId!: number;

  @Column({ type: "text" })
  token!: string;

  @Column({ type: "text" })
  balance!: string;

  @Column({ type: "int", nullable: true })
  decimals!: number | null;

  @Column({ type: "text", nullable: true })
  symbol!: string | null;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
