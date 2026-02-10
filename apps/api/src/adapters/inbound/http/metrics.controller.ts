import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { MetricsQuery } from "../../../application/queries/metrics.query";
import { toMetricsDto } from "../mappers/api.mapper";
import { MetricsDto } from "../dto/metrics.dto";

@ApiTags("metrics")
@Controller()
export class MetricsController {
  constructor(private readonly query: MetricsQuery) {}

  @ApiOperation({ summary: "Health check" })
  @ApiOkResponse({
    schema: { example: { status: "ok" } },
  })
  @Get("/health")
  health() {
    return { status: "ok" };
  }

  @ApiOperation({ summary: "Get user metrics" })
  @ApiParam({ name: "user", description: "User identifier (e.g. address)", example: "0x1234...abcd" })
  @ApiOkResponse({ type: MetricsDto })
  @Get("/metrics/:user")
  async getMetrics(@Param("user") user: string): Promise<MetricsDto> {
    const row = await this.query.getByUser(user);
    return toMetricsDto(user, row);
  }
}
