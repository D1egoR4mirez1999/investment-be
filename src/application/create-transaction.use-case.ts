import type { TransactionRepository } from '../domain/ports/transaction.repository.js';
import { Transaction } from '../domain/transaction/transaction.js';
import type {
  TransactionCategory,
  TransactionType,
} from '../domain/transaction/transaction-enums.js';

export interface CreateTransactionCommand {
  businessId: string;
  userId: string;
  type: TransactionType;
  category: TransactionCategory;
  amountCents: number;
  occurredOn: string;
  note?: string;
}

export class CreateTransactionUseCase {
  constructor(private readonly transactions: TransactionRepository) {}

  async execute(command: CreateTransactionCommand): Promise<Transaction> {
    const transaction = Transaction.create({
      businessId: command.businessId,
      createdById: command.userId,
      type: command.type,
      category: command.category,
      amountCents: command.amountCents,
      occurredOn: command.occurredOn,
      note: command.note,
    });

    return this.transactions.save(transaction);
  }
}
