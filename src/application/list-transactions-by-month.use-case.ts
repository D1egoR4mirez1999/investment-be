import type { TransactionRepository } from '../domain/ports/transaction.repository.js';
import { YearMonth } from '../domain/shared/year-month.js';
import type { Transaction } from '../domain/transaction/transaction.js';

export class ListTransactionsByMonthUseCase {
  constructor(private readonly transactions: TransactionRepository) {}

  async execute(
    businessId: string,
    year: number,
    month: number,
  ): Promise<Transaction[]> {
    const yearMonth = YearMonth.create(year, month);
    return this.transactions.findByMonth(businessId, yearMonth);
  }
}
