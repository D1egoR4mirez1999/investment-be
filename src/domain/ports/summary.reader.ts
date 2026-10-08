export const SUMMARY_READER = Symbol('SUMMARY_READER');

export interface SummaryTransactionRow {
  type: 'INCOME' | 'EXPENSE';
  amountCents: number;
  occurredOn: string;
}

export interface SummaryBusinessData {
  totalInvestmentCents: number;
  investorPercent: number;
  partnerPercent: number;
  transactions: SummaryTransactionRow[];
}

export interface SummaryReader {
  loadForMonth(
    businessId: string,
    endDate: string,
  ): Promise<SummaryBusinessData | null>;
}
