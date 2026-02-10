import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class BalanceDto {
  @ApiProperty({ example: "0x1234...abcd" })
  user!: string;

  @ApiProperty({ example: 1 })
  chainId!: number;

  @ApiProperty({ example: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" })
  token!: string;

  @ApiProperty({ example: "1000000", description: "Raw token balance as string (base units)." })
  balance!: string;

  @ApiPropertyOptional({ example: "USDC", nullable: true })
  symbol?: string | null;

  @ApiPropertyOptional({ example: 6, nullable: true })
  decimals?: number | null;
}
