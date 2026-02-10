import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePortfolioTables1700000000002 implements MigrationInterface {
  name = "CreatePortfolioTables1700000000002";
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS portfolio`);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS portfolio.user_balances (
        id SERIAL PRIMARY KEY,
        user_address varchar NOT NULL,
        chain_id integer NOT NULL,
        token varchar NOT NULL,
        balance varchar NOT NULL,
        symbol varchar NULL,
        decimals integer NULL,
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE(user_address, chain_id, token)
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_portfolio_user_address ON portfolio.user_balances (user_address)`,
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS portfolio.user_balances`);
  }
}
