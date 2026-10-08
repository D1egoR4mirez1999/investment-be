import { Injectable } from '@nestjs/common';
import type { TransactionRepository } from '../../domain/ports/transaction.repository.js';
import type { YearMonth } from '../../domain/shared/year-month.js';
import { Transaction } from '../../domain/transaction/transaction.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  toDomainTransaction,
  toPrismaTransactionData,
} from './mappers.js';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const created = await this.prisma.transaction.create({
      data: toPrismaTransactionData(transaction),
    });
    return toDomainTransaction(created);
  }

  async findByMonth(
    businessId: string,
    yearMonth: YearMonth,
  ): Promise<Transaction[]> {
    const rows = await this.prisma.transaction.findMany({
      where: {
        businessId,
        occurredOn: {
          gte: yearMonth.startDate(),
          lte: yearMonth.endDate(),
        },
      },
      orderBy: [{ occurredOn: 'asc' }, { createdAt: 'asc' }],
    });

    return rows.map(toDomainTransaction);
  }
}
