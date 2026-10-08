import { Module } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/create-transaction.use-case.js';
import { ListTransactionsByMonthUseCase } from '../../application/list-transactions-by-month.use-case.js';
import {
  TRANSACTION_REPOSITORY,
  type TransactionRepository,
} from '../../domain/ports/transaction.repository.js';
import { PrismaTransactionRepository } from '../../infrastructure/persistence/prisma-transaction.repository.js';
import { BusinessesModule } from '../businesses/businesses.module.js';
import { TransactionsController } from './transactions.controller.js';

@Module({
  imports: [BusinessesModule],
  controllers: [TransactionsController],
  providers: [
    {
      provide: TRANSACTION_REPOSITORY,
      useClass: PrismaTransactionRepository,
    },
    {
      provide: CreateTransactionUseCase,
      useFactory: (transactions: TransactionRepository) =>
        new CreateTransactionUseCase(transactions),
      inject: [TRANSACTION_REPOSITORY],
    },
    {
      provide: ListTransactionsByMonthUseCase,
      useFactory: (transactions: TransactionRepository) =>
        new ListTransactionsByMonthUseCase(transactions),
      inject: [TRANSACTION_REPOSITORY],
    },
  ],
})
export class TransactionsModule {}
