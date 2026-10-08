import type { Transaction as PrismaTransaction } from '@prisma/client';
import { Transaction } from '../../domain/transaction/transaction.js';
import {
  TransactionCategory,
  TransactionType,
} from '../../domain/transaction/transaction-enums.js';

export function toDomainTransaction(row: PrismaTransaction): Transaction {
  return Transaction.reconstitute({
    id: row.id,
    businessId: row.businessId,
    createdById: row.createdById,
    type: row.type as TransactionType,
    category: row.category as TransactionCategory,
    amountCents: row.amountCents,
    occurredOn: row.occurredOn,
    note: row.note,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export function toPrismaTransactionData(transaction: Transaction) {
  return {
    businessId: transaction.businessId,
    createdById: transaction.createdById,
    type: transaction.type,
    category: transaction.category,
    amountCents: transaction.amountCents,
    occurredOn: transaction.occurredOn,
    note: transaction.note ?? null,
  };
}
