import { Transaction } from '../transaction/transaction.js';
import { YearMonth } from '../shared/year-month.js';

export const TRANSACTION_REPOSITORY = Symbol('TRANSACTION_REPOSITORY');

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Transaction>;
  findByMonth(businessId: string, yearMonth: YearMonth): Promise<Transaction[]>;
}
