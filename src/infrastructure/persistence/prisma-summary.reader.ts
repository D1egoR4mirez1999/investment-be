import { Injectable } from '@nestjs/common';
import { MembershipRole } from '@prisma/client';
import { BusinessMembershipsIncompleteError } from '../../domain/shared/domain-error.js';
import type {
  SummaryBusinessData,
  SummaryReader,
} from '../../domain/ports/summary.reader.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PrismaSummaryReader implements SummaryReader {
  constructor(private readonly prisma: PrismaService) {}

  async loadForMonth(
    businessId: string,
    endDate: string,
  ): Promise<SummaryBusinessData | null> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      include: {
        investments: true,
        memberships: true,
      },
    });

    if (!business) {
      return null;
    }

    const investor = business.memberships.find(
      (membership) => membership.role === MembershipRole.INVESTOR,
    );
    const partner = business.memberships.find(
      (membership) => membership.role === MembershipRole.PARTNER,
    );

    if (!investor || !partner) {
      throw new BusinessMembershipsIncompleteError();
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        businessId,
        occurredOn: { lte: endDate },
      },
      select: {
        type: true,
        amountCents: true,
        occurredOn: true,
      },
      orderBy: { occurredOn: 'asc' },
    });

    return {
      totalInvestmentCents: business.investments.reduce(
        (sum, investment) => sum + investment.amountCents,
        0,
      ),
      investorPercent: investor.sharePercent,
      partnerPercent: partner.sharePercent,
      transactions: transactions.map((tx) => ({
        type: tx.type,
        amountCents: tx.amountCents,
        occurredOn: tx.occurredOn,
      })),
    };
  }
}
