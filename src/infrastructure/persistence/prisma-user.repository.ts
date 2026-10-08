import { Injectable } from '@nestjs/common';
import type {
  UserPublicView,
  UserRecord,
  UserRepository,
} from '../../domain/ports/user.repository.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserRecord | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    };
  }

  async findPublicById(userId: string): Promise<UserPublicView | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
  }
}
