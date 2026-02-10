import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { PortfolioQuery } from "../../../application/queries/portfolio.query";
import { toBalanceDtos } from "../mappers/api.mapper";
import { BalanceDto } from "../dto/balance.dto";

@ApiTags("portfolio")
@Controller()
export class PortfolioController {
  constructor(private readonly query: PortfolioQuery) {}

  @ApiOperation({ summary: "Get user balances" })
  @ApiParam({ name: "user", description: "User identifier (e.g. address)", example: "0x1234...abcd" })
  @ApiOkResponse({ type: BalanceDto, isArray: true })
  @Get("/balances/:user")
  async getBalances(@Param("user") user: string): Promise<BalanceDto[]> {
    const rows = await this.query.getBalances(user);
    return toBalanceDtos(rows);
  }
}
