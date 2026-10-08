import { Module } from '@nestjs/common';
import { GetBusinessUseCase } from '../../application/get-business.use-case.js';
import { ListBusinessesUseCase } from '../../application/list-businesses.use-case.js';
import {
  BUSINESS_REPOSITORY,
  type BusinessRepository,
} from '../../domain/ports/business.repository.js';
import { MEMBERSHIP_LOOKUP } from '../../domain/ports/membership.lookup.js';
import { PrismaBusinessRepository } from '../../infrastructure/persistence/prisma-business.repository.js';
import { PrismaMembershipLookup } from '../../infrastructure/persistence/prisma-membership.lookup.js';
import { BusinessesController } from './businesses.controller.js';
import { BusinessMembershipGuard } from './guards/business-membership.guard.js';

@Module({
  controllers: [BusinessesController],
  providers: [
    {
      provide: BUSINESS_REPOSITORY,
      useClass: PrismaBusinessRepository,
    },
    {
      provide: MEMBERSHIP_LOOKUP,
      useClass: PrismaMembershipLookup,
    },
    {
      provide: ListBusinessesUseCase,
      useFactory: (businesses: BusinessRepository) =>
        new ListBusinessesUseCase(businesses),
      inject: [BUSINESS_REPOSITORY],
    },
    {
      provide: GetBusinessUseCase,
      useFactory: (businesses: BusinessRepository) =>
        new GetBusinessUseCase(businesses),
      inject: [BUSINESS_REPOSITORY],
    },
    BusinessMembershipGuard,
  ],
  exports: [MEMBERSHIP_LOOKUP, BusinessMembershipGuard],
})
export class BusinessesModule {}
