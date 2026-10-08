import { Injectable } from '@nestjs/common';
import type {
  BusinessRepository,
  BusinessView,
} from '../../domain/ports/business.repository.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PrismaBusinessRepository implements BusinessRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string): Promise<BusinessView[]> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: {
        business: {
          include: {
            investments: true,
            memberships: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return memberships.map((membership) => this.toView(membership));
  }

  async findOneForUser(
    userId: string,
    businessId: string,
  ): Promise<BusinessView | null> {
    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_businessId: { userId, businessId },
      },
      include: {
        business: {
          include: {
            investments: true,
            memberships: {
              include: {
                user: {
                  select: { id: true, name: true, email: true },
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return null;
    }

    return this.toView(membership);
  }

  private toView(membership: {
    role: string;
    sharePercent: number;
    business: {
      id: string;
      name: string;
      investments: Array<{ amountCents: number }>;
      memberships: Array<{
        role: string;
        sharePercent: number;
        user: { id: string; name: string; email: string };
      }>;
    };
  }): BusinessView {
    return {
      id: membership.business.id,
      name: membership.business.name,
      role: membership.role,
      sharePercent: membership.sharePercent,
      totalInvestmentCents: membership.business.investments.reduce(
        (sum, investment) => sum + investment.amountCents,
        0,
      ),
      members: membership.business.memberships.map((member) => ({
        userId: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.role,
        sharePercent: member.sharePercent,
      })),
    };
  }
}
