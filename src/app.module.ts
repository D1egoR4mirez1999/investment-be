import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module.js';
import { AuthModule } from './http/auth/auth.module.js';
import { BusinessesModule } from './http/businesses/businesses.module.js';
import { SummaryModule } from './http/summary/summary.module.js';
import { TransactionsModule } from './http/transactions/transactions.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    BusinessesModule,
    TransactionsModule,
    SummaryModule,
  ],
})
export class AppModule {}
