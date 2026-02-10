export type UserBalanceRecord = {
  user: string;
  chainId: number;
  token: string;
  balance: string;
  symbol?: string | null;
  decimals?: number | null;
};

export interface UserBalanceRepositoryPort {
  upsert(record: UserBalanceRecord): Promise<void>;
  findByUser(user: string): Promise<UserBalanceRecord[]>;
}
