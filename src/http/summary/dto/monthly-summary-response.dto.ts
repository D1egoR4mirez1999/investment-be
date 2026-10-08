import { ApiProperty } from '@nestjs/swagger';

export class MonthlySummaryResponseDto {
  year!: number;
  month!: number;
  incomeCents!: number;
  expenseCents!: number;
  profitCents!: number;
  investorPercent!: number;
  partnerPercent!: number;
  investorShareCents!: number;
  partnerShareCents!: number;
  recoveredThisMonthCents!: number;
  investorProfitThisMonthCents!: number;
  recoveredCumulativeCents!: number;
  remainingInvestmentCents!: number;
  totalInvestmentCents!: number;

  @ApiProperty({
    enum: ['en_recuperacion', 'recuperado', 'perdida_del_mes'],
  })
  status!: 'en_recuperacion' | 'recuperado' | 'perdida_del_mes';
}
