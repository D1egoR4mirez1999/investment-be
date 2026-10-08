import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type {
  TokenIssuer,
  TokenPayload,
} from '../../domain/ports/token-issuer.js';

@Injectable()
export class JwtTokenIssuer implements TokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  sign(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verify(token: string): Promise<TokenPayload> {
    return this.jwtService.verifyAsync<TokenPayload>(token);
  }
}
