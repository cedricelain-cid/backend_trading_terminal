import { Column, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "user_metrics", schema: "metrics" })
export class UserMetricsEntity {
  @PrimaryColumn({ type: "text", name: "user_address" })
  userAddress!: string;

  @Column({ type: "double precision", default: 0, name: "realized_pnl_usd" })
  realizedPnlUsd!: number;

  @Column({ type: "double precision", default: 0, name: "volume_usd" })
  volumeUsd!: number;

  @Column({ type: "double precision", default: 0, name: "fees_usd" })
  feesUsd!: number;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
