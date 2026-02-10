import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMetricsTables1700000000001 implements MigrationInterface {
  name = "CreateMetricsTables1700000000001";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS metrics`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS metrics.user_metrics (
        user_address varchar PRIMARY KEY,
        volume_usd double precision NOT NULL DEFAULT 0,
        fees_usd double precision NOT NULL DEFAULT 0,
        realized_pnl_usd double precision NOT NULL DEFAULT 0,
        tx_hash varchar NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_metrics_user_address ON metrics.user_metrics (user_address)`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS metrics.user_metrics`);
  }
}
