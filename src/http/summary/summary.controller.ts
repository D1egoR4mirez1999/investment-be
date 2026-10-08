import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetMonthlySummaryUseCase } from '../../application/get-monthly-summary.use-case.js';
import { BusinessMembershipGuard } from '../businesses/guards/business-membership.guard.js';
import { MonthlySummaryResponseDto } from './dto/monthly-summary-response.dto.js';

@ApiTags('Summary')
@ApiBearerAuth()
@Controller('businesses/:id')
@UseGuards(BusinessMembershipGuard)
export class SummaryController {
  constructor(
    private readonly getMonthlySummaryUseCase: GetMonthlySummaryUseCase,
  ) {}

  @Get('summary')
  @ApiOperation({ summary: 'Get monthly investment recovery summary' })
  @ApiQuery({ name: 'year', type: Number, example: 2026, description: '2000-2100' })
  @ApiQuery({ name: 'month', type: Number, example: 10, description: '1-12' })
  @ApiOkResponse({ type: MonthlySummaryResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiForbiddenResponse({ description: 'User is not a member of this business' })
  @ApiNotFoundResponse({ description: 'Business not found' })
  getSummary(
    @Param('id') businessId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<MonthlySummaryResponseDto> {
    return this.getMonthlySummaryUseCase.execute(businessId, year, month);
  }
}
