import {
  TransactionCategory,
  TransactionType,
} from '../../../domain/transaction/transaction-enums.js';

export class TransactionResponseDto {
  id?: string;
  businessId!: string;
  createdById!: string;
  type!: TransactionType;
  category!: TransactionCategory;
  amountCents!: number;
  occurredOn!: string;
  note?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
