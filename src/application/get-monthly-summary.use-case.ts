import { BusinessNotFoundError } from '../domain/shared/domain-error.js';
import { YearMonth } from '../domain/shared/year-month.js';
import type { SummaryReader } from '../domain/ports/summary.reader.js';
import {
  computeMonthlySummary,
  groupTransactionsByMonth,
  type MonthlySummaryResult,
} from '../domain/summary/monthly-summary.js';

export class GetMonthlySummaryUseCase {
  constructor(private readonly summaryReader: SummaryReader) {}

  async execute(
    businessId: string,
    year: number,
    month: number,
  ): Promise<MonthlySummaryResult> {
    const yearMonth = YearMonth.create(year, month);
    const data = await this.summaryReader.loadForMonth(
      businessId,
      yearMonth.endDate(),
    );

    if (!data) {
      throw new BusinessNotFoundError();
    }

    const months = groupTransactionsByMonth(
      data.transactions,
      yearMonth.year,
      yearMonth.month,
    );

    return computeMonthlySummary({
      totalInvestmentCents: data.totalInvestmentCents,
      investorPercent: data.investorPercent,
      partnerPercent: data.partnerPercent,
      monthsChronological: months,
      targetYear: yearMonth.year,
      targetMonth: yearMonth.month,
    });
  }
}
