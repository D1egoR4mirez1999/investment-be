import { InvalidCategoryError } from '../shared/domain-error.js';
import {
  TransactionCategory,
  TransactionType,
} from './transaction-enums.js';

const INCOME_CATEGORIES = new Set<string>([
  TransactionCategory.HAIRCUT,
  TransactionCategory.MAKEUP,
  TransactionCategory.OTHER,
]);

const EXPENSE_CATEGORIES = new Set<string>([
  TransactionCategory.PRODUCTS,
  TransactionCategory.RENT,
  TransactionCategory.UTILITIES,
  TransactionCategory.SUPPLIES,
  TransactionCategory.OTHER,
]);

export function assertCategoryMatchesType(
  type: TransactionType,
  category: TransactionCategory,
): void {
  const allowed =
    type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (!allowed.has(category)) {
    throw new InvalidCategoryError(
      `Category ${category} is not valid for type ${type}`,
    );
  }
}
