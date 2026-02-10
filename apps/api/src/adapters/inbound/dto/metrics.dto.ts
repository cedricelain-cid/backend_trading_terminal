import { ApiProperty } from "@nestjs/swagger";

export class MetricsDto {
  @ApiProperty({ example: "0x1234...abcd" })
  user!: string;

  @ApiProperty({ example: 12345.67 })
  volumeUsd!: number;

  @ApiProperty({ example: 12.34 })
  feesUsd!: number;

  @ApiProperty({ example: -56.78 })
  realizedPnlUsd!: number;
}
