export const TOKEN_ISSUER = Symbol('TOKEN_ISSUER');

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenIssuer {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload>;
}
