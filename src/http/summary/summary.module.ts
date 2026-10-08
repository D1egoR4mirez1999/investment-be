import { Module } from '@nestjs/common';
import { GetMonthlySummaryUseCase } from '../../application/get-monthly-summary.use-case.js';
import {
  SUMMARY_READER,
  type SummaryReader,
} from '../../domain/ports/summary.reader.js';
import { PrismaSummaryReader } from '../../infrastructure/persistence/prisma-summary.reader.js';
import { BusinessesModule } from '../businesses/businesses.module.js';
import { SummaryController } from './summary.controller.js';

@Module({
  imports: [BusinessesModule],
  controllers: [SummaryController],
  providers: [
    {
      provide: SUMMARY_READER,
      useClass: PrismaSummaryReader,
    },
    {
      provide: GetMonthlySummaryUseCase,
      useFactory: (summaryReader: SummaryReader) =>
        new GetMonthlySummaryUseCase(summaryReader),
      inject: [SUMMARY_READER],
    },
  ],
})
export class SummaryModule {}
