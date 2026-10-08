import { InvalidYearMonthError } from './domain-error.js';

export class YearMonth {
  readonly year: number;
  readonly month: number;

  private constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  static create(year: number, month: number): YearMonth {
    if (!Number.isInteger(year) || year < 2000 || year > 2100) {
      throw new InvalidYearMonthError('Invalid year');
    }
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new InvalidYearMonthError('Invalid month');
    }
    return new YearMonth(year, month);
  }

  startDate(): string {
    return `${this.year}-${String(this.month).padStart(2, '0')}-01`;
  }

  endDate(): string {
    const lastDay = new Date(Date.UTC(this.year, this.month, 0)).getUTCDate();
    return `${this.year}-${String(this.month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  }
}
