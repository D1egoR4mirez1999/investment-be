export type MonthlyStatus =
  | 'en_recuperacion'
  | 'recuperado'
  | 'perdida_del_mes';

export interface MonthInput {
  year: number;
  month: number;
  incomeCents: number;
  expenseCents: number;
}

export interface MonthlySummaryResult {
  year: number;
  month: number;
  incomeCents: number;
  expenseCents: number;
  profitCents: number;
  investorPercent: number;
  partnerPercent: number;
  investorShareCents: number;
  partnerShareCents: number;
  recoveredThisMonthCents: number;
  investorProfitThisMonthCents: number;
  recoveredCumulativeCents: number;
  remainingInvestmentCents: number;
  totalInvestmentCents: number;
  status: MonthlyStatus;
}

/**
 * Pure money rules for v1:
 * - Share applies to monthly profit only.
 * - Loss month => investor/partner share = 0; remaining capital unchanged.
 * - Investor share pays capital first; surplus becomes investor profit.
 */
export function computeMonthlySummary(params: {
  totalInvestmentCents: number;
  investorPercent: number;
  partnerPercent: number;
  monthsChronological: MonthInput[];
  targetYear: number;
  targetMonth: number;
}): MonthlySummaryResult {
  const {
    totalInvestmentCents,
    investorPercent,
    partnerPercent,
    monthsChronological,
    targetYear,
    targetMonth,
  } = params;

  let recoveredCumulative = 0;
  let result: MonthlySummaryResult | undefined;

  for (const month of monthsChronological) {
    const profitCents = month.incomeCents - month.expenseCents;
    let investorShareCents = 0;
    let partnerShareCents = 0;
    let recoveredThisMonthCents = 0;
    let investorProfitThisMonthCents = 0;
    let status: MonthlyStatus;

    if (profitCents > 0) {
      investorShareCents = Math.floor((profitCents * investorPercent) / 100);
      partnerShareCents = Math.floor((profitCents * partnerPercent) / 100);

      const remainingBefore = Math.max(
        0,
        totalInvestmentCents - recoveredCumulative,
      );
      recoveredThisMonthCents = Math.min(investorShareCents, remainingBefore);
      investorProfitThisMonthCents =
        investorShareCents - recoveredThisMonthCents;
      recoveredCumulative += recoveredThisMonthCents;

      status =
        recoveredCumulative >= totalInvestmentCents
          ? 'recuperado'
          : 'en_recuperacion';
    } else {
      status = 'perdida_del_mes';
    }

    const remainingInvestmentCents = Math.max(
      0,
      totalInvestmentCents - recoveredCumulative,
    );

    if (month.year === targetYear && month.month === targetMonth) {
      result = {
        year: month.year,
        month: month.month,
        incomeCents: month.incomeCents,
        expenseCents: month.expenseCents,
        profitCents,
        investorPercent,
        partnerPercent,
        investorShareCents,
        partnerShareCents,
        recoveredThisMonthCents,
        investorProfitThisMonthCents,
        recoveredCumulativeCents: recoveredCumulative,
        remainingInvestmentCents,
        totalInvestmentCents,
        status,
      };
      break;
    }
  }

  if (!result) {
    const remainingInvestmentCents = Math.max(
      0,
      totalInvestmentCents - recoveredCumulative,
    );
    result = {
      year: targetYear,
      month: targetMonth,
      incomeCents: 0,
      expenseCents: 0,
      profitCents: 0,
      investorPercent,
      partnerPercent,
      investorShareCents: 0,
      partnerShareCents: 0,
      recoveredThisMonthCents: 0,
      investorProfitThisMonthCents: 0,
      recoveredCumulativeCents: recoveredCumulative,
      remainingInvestmentCents,
      totalInvestmentCents,
      status:
        recoveredCumulative >= totalInvestmentCents && totalInvestmentCents > 0
          ? 'recuperado'
          : 'en_recuperacion',
    };
  }

  return result;
}

export function groupTransactionsByMonth(
  transactions: Array<{
    type: 'INCOME' | 'EXPENSE';
    amountCents: number;
    occurredOn: string;
  }>,
  upToYear: number,
  upToMonth: number,
): MonthInput[] {
  const map = new Map<string, MonthInput>();

  for (const tx of transactions) {
    const [yearStr, monthStr] = tx.occurredOn.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (year > upToYear || (year === upToYear && month > upToMonth)) {
      continue;
    }

    const key = `${year}-${String(month).padStart(2, '0')}`;
    const current = map.get(key) ?? {
      year,
      month,
      incomeCents: 0,
      expenseCents: 0,
    };

    if (tx.type === 'INCOME') {
      current.incomeCents += tx.amountCents;
    } else {
      current.expenseCents += tx.amountCents;
    }
    map.set(key, current);
  }

  // Ensure the target month exists even with zero transactions.
  const targetKey = `${upToYear}-${String(upToMonth).padStart(2, '0')}`;
  if (!map.has(targetKey)) {
    map.set(targetKey, {
      year: upToYear,
      month: upToMonth,
      incomeCents: 0,
      expenseCents: 0,
    });
  }

  return [...map.values()].sort((a, b) =>
    a.year === b.year ? a.month - b.month : a.year - b.year,
  );
}
