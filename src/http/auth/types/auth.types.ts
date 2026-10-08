import { Request } from 'express';
import type { TokenPayload } from '../../../domain/ports/token-issuer.js';

export type JwtPayload = TokenPayload;

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
