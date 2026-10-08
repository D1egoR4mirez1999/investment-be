import { PrismaClient, MembershipRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.transaction.deleteMany();
  await prisma.investment.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  const investor = await prisma.user.create({
    data: {
      email: 'investor@example.com',
      name: 'Inversionista',
      passwordHash,
    },
  });

  const partner = await prisma.user.create({
    data: {
      email: 'partner@example.com',
      name: 'Socia',
      passwordHash,
    },
  });

  const business = await prisma.business.create({
    data: {
      name: 'Sala de belleza',
      memberships: {
        create: [
          {
            userId: investor.id,
            role: MembershipRole.INVESTOR,
            sharePercent: 40,
          },
          {
            userId: partner.id,
            role: MembershipRole.PARTNER,
            sharePercent: 60,
          },
        ],
      },
      investments: {
        create: {
          amountCents: 5_000_000,
          investedOn: '2026-01-01',
          note: 'Inversión inicial',
        },
      },
    },
  });

  console.log('Seed OK');
  console.log({
    investor: investor.email,
    partner: partner.email,
    business: business.name,
    password: 'password123',
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
