import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DomainError } from '../../domain/shared/domain-error.js';

const STATUS_BY_CODE: Record<string, HttpStatus> = {
  INVALID_YEAR_MONTH: HttpStatus.BAD_REQUEST,
  INVALID_CATEGORY: HttpStatus.BAD_REQUEST,
  BUSINESS_MEMBERSHIPS_INCOMPLETE: HttpStatus.BAD_REQUEST,
  BUSINESS_NOT_FOUND: HttpStatus.NOT_FOUND,
  INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
  USER_NOT_FOUND: HttpStatus.UNAUTHORIZED,
};

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      STATUS_BY_CODE[exception.code] ?? HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: exception.name,
    });
  }
}
