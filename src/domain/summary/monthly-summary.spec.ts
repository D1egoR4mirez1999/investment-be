import { describe, expect, it } from 'vitest';
import { computeMonthlySummary } from './monthly-summary.js';

describe('computeMonthlySummary', () => {
  it('splits a profitable month and recovers capital first', () => {
    const result = computeMonthlySummary({
      totalInvestmentCents: 5_000_000,
      investorPercent: 40,
      partnerPercent: 60,
      monthsChronological: [
        {
          year: 2026,
          month: 3,
          incomeCents: 1_800_000,
          expenseCents: 700_000,
        },
      ],
      targetYear: 2026,
      targetMonth: 3,
    });

    // profit 1_100_000 → investor 440_000, partner 660_000
    expect(result.profitCents).toBe(1_100_000);
    expect(result.investorShareCents).toBe(440_000);
    expect(result.partnerShareCents).toBe(660_000);
    expect(result.recoveredThisMonthCents).toBe(440_000);
    expect(result.investorProfitThisMonthCents).toBe(0);
    expect(result.recoveredCumulativeCents).toBe(440_000);
    expect(result.remainingInvestmentCents).toBe(4_560_000);
    expect(result.status).toBe('en_recuperacion');
  });

  it('sets investor and partner share to 0 on a loss month without increasing remaining', () => {
    const result = computeMonthlySummary({
      totalInvestmentCents: 5_000_000,
      investorPercent: 40,
      partnerPercent: 60,
      monthsChronological: [
        {
          year: 2026,
          month: 1,
          incomeCents: 1_000_000,
          expenseCents: 200_000,
        },
        {
          year: 2026,
          month: 2,
          incomeCents: 100_000,
          expenseCents: 500_000,
        },
      ],
      targetYear: 2026,
      targetMonth: 2,
    });

    // Jan recovered 320_000; Feb loss leaves remaining unchanged
    expect(result.profitCents).toBe(-400_000);
    expect(result.investorShareCents).toBe(0);
    expect(result.partnerShareCents).toBe(0);
    expect(result.recoveredThisMonthCents).toBe(0);
    expect(result.recoveredCumulativeCents).toBe(320_000);
    expect(result.remainingInvestmentCents).toBe(4_680_000);
    expect(result.status).toBe('perdida_del_mes');
  });

  it('closes capital mid-month and treats surplus as investor profit', () => {
    const result = computeMonthlySummary({
      totalInvestmentCents: 500_000,
      investorPercent: 40,
      partnerPercent: 60,
      monthsChronological: [
        {
          year: 2026,
          month: 1,
          incomeCents: 800_000,
          expenseCents: 100_000,
        },
        {
          year: 2026,
          month: 2,
          incomeCents: 900_000,
          expenseCents: 100_000,
        },
      ],
      targetYear: 2026,
      targetMonth: 2,
    });

    // Jan: profit 700_000 → investor 280_000 recovered; remaining 220_000
    // Feb: profit 800_000 → investor 320_000; recover 220_000, profit 100_000
    expect(result.investorShareCents).toBe(320_000);
    expect(result.recoveredThisMonthCents).toBe(220_000);
    expect(result.investorProfitThisMonthCents).toBe(100_000);
    expect(result.recoveredCumulativeCents).toBe(500_000);
    expect(result.remainingInvestmentCents).toBe(0);
    expect(result.status).toBe('recuperado');
  });
});
