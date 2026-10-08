export type DomainErrorCode =
  | 'INVALID_YEAR_MONTH'
  | 'INVALID_CATEGORY'
  | 'BUSINESS_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'BUSINESS_MEMBERSHIPS_INCOMPLETE';

export class DomainError extends Error {
  readonly code: DomainErrorCode;

  constructor(code: DomainErrorCode, message: string) {
    super(message);
    this.name = 'DomainError';
    this.code = code;
  }
}

export class InvalidYearMonthError extends DomainError {
  constructor(message: string) {
    super('INVALID_YEAR_MONTH', message);
    this.name = 'InvalidYearMonthError';
  }
}

export class InvalidCategoryError extends DomainError {
  constructor(message: string) {
    super('INVALID_CATEGORY', message);
    this.name = 'InvalidCategoryError';
  }
}

export class BusinessNotFoundError extends DomainError {
  constructor(message = 'Business not found') {
    super('BUSINESS_NOT_FOUND', message);
    this.name = 'BusinessNotFoundError';
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor(message = 'Invalid credentials') {
    super('INVALID_CREDENTIALS', message);
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends DomainError {
  constructor(message = 'User not found') {
    super('USER_NOT_FOUND', message);
    this.name = 'UserNotFoundError';
  }
}

export class BusinessMembershipsIncompleteError extends DomainError {
  constructor(
    message = 'Business must have investor and partner memberships',
  ) {
    super('BUSINESS_MEMBERSHIPS_INCOMPLETE', message);
    this.name = 'BusinessMembershipsIncompleteError';
  }
}
