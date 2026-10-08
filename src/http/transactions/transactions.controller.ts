import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateTransactionUseCase } from '../../application/create-transaction.use-case.js';
import { ListTransactionsByMonthUseCase } from '../../application/list-transactions-by-month.use-case.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/types/auth.types.js';
import { BusinessMembershipGuard } from '../businesses/guards/business-membership.guard.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { TransactionResponseDto } from './dto/transaction-response.dto.js';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('businesses/:id/transactions')
@UseGuards(BusinessMembershipGuard)
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly listTransactionsByMonthUseCase: ListTransactionsByMonthUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List transactions for a business month' })
  @ApiQuery({ name: 'year', type: Number, example: 2026, description: '2000-2100' })
  @ApiQuery({ name: 'month', type: Number, example: 10, description: '1-12' })
  @ApiOkResponse({ type: TransactionResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiForbiddenResponse({ description: 'User is not a member of this business' })
  @ApiNotFoundResponse({ description: 'Business not found' })
  findByMonth(
    @Param('id') businessId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ): Promise<TransactionResponseDto[]> {
    return this.listTransactionsByMonthUseCase.execute(
      businessId,
      year,
      month,
    );
  }

  @Post()
  @ApiOperation({
    summary: 'Create a transaction',
    description:
      'INCOME categories: HAIRCUT, MAKEUP, OTHER. EXPENSE categories: PRODUCTS, RENT, UTILITIES, SUPPLIES, OTHER. amountCents is an integer >= 1. occurredOn must be YYYY-MM-DD.',
  })
  @ApiCreatedResponse({ type: TransactionResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiForbiddenResponse({ description: 'User is not a member of this business' })
  @ApiNotFoundResponse({ description: 'Business not found' })
  create(
    @Param('id') businessId: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.createTransactionUseCase.execute({
      businessId,
      userId: user.sub,
      type: dto.type,
      category: dto.category,
      amountCents: dto.amountCents,
      occurredOn: dto.occurredOn,
      note: dto.note,
    });
  }
}
