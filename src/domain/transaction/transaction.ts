import { assertCategoryMatchesType } from './category-policy.js';
import {
  TransactionCategory,
  TransactionType,
} from './transaction-enums.js';

export interface CreateTransactionProps {
  businessId: string;
  createdById: string;
  type: TransactionType;
  category: TransactionCategory;
  amountCents: number;
  occurredOn: string;
  note?: string;
}

export interface TransactionProps {
  id?: string;
  businessId: string;
  createdById: string;
  type: TransactionType;
  category: TransactionCategory;
  amountCents: number;
  occurredOn: string;
  note?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Transaction {
  readonly id?: string;
  readonly businessId: string;
  readonly createdById: string;
  readonly type: TransactionType;
  readonly category: TransactionCategory;
  readonly amountCents: number;
  readonly occurredOn: string;
  readonly note?: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;

  private constructor(props: TransactionProps) {
    this.id = props.id;
    this.businessId = props.businessId;
    this.createdById = props.createdById;
    this.type = props.type;
    this.category = props.category;
    this.amountCents = props.amountCents;
    this.occurredOn = props.occurredOn;
    this.note = props.note;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: CreateTransactionProps): Transaction {
    assertCategoryMatchesType(props.type, props.category);
    return new Transaction(props);
  }

  static reconstitute(props: TransactionProps): Transaction {
    return new Transaction(props);
  }
}
