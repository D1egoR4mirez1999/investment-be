import { Injectable } from '@nestjs/common';
import type {
  MembershipLookup,
  MembershipRecord,
} from '../../domain/ports/membership.lookup.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PrismaMembershipLookup implements MembershipLookup {
  constructor(private readonly prisma: PrismaService) {}

  async businessExists(businessId: string): Promise<boolean> {
    const business = await this.prisma.business.findUnique({
      where: { id: businessId },
      select: { id: true },
    });
    return business !== null;
  }

  async findMembership(
    userId: string,
    businessId: string,
  ): Promise<MembershipRecord | null> {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
    });

    if (!membership) {
      return null;
    }

    return {
      id: membership.id,
      userId: membership.userId,
      businessId: membership.businessId,
      role: membership.role,
      sharePercent: membership.sharePercent,
      createdAt: membership.createdAt,
      updatedAt: membership.updatedAt,
    };
  }
}
