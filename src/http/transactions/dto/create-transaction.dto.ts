import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import {
  TransactionCategory,
  TransactionType,
} from '../../../domain/transaction/transaction-enums.js';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsEnum(TransactionCategory)
  category!: TransactionCategory;

  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'occurredOn must be YYYY-MM-DD',
  })
  occurredOn!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
