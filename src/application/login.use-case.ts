import { InvalidCredentialsError } from '../domain/shared/domain-error.js';
import type { PasswordHasher } from '../domain/ports/password-hasher.js';
import type { TokenIssuer } from '../domain/ports/token-issuer.js';
import type { UserRepository } from '../domain/ports/user.repository.js';

export interface LoginCommand {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
}

export class LoginUseCase {
  constructor(
    private readonly users: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly tokenIssuer: TokenIssuer,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const user = await this.users.findByEmail(command.email.toLowerCase());
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await this.passwordHasher.compare(
      command.password,
      user.passwordHash,
    );
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      accessToken: await this.tokenIssuer.sign({
        sub: user.id,
        email: user.email,
      }),
    };
  }
}
