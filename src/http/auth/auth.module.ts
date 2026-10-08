import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { GetCurrentUserUseCase } from '../../application/get-current-user.use-case.js';
import { LoginUseCase } from '../../application/login.use-case.js';
import { PASSWORD_HASHER } from '../../domain/ports/password-hasher.js';
import type { PasswordHasher } from '../../domain/ports/password-hasher.js';
import { TOKEN_ISSUER } from '../../domain/ports/token-issuer.js';
import type { TokenIssuer } from '../../domain/ports/token-issuer.js';
import { USER_REPOSITORY } from '../../domain/ports/user.repository.js';
import type { UserRepository } from '../../domain/ports/user.repository.js';
import { PrismaUserRepository } from '../../infrastructure/persistence/prisma-user.repository.js';
import { BcryptPasswordHasher } from '../../infrastructure/security/bcrypt-password-hasher.js';
import { JwtTokenIssuer } from '../../infrastructure/security/jwt-token-issuer.js';
import { AuthController } from './auth.controller.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-me-in-production',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: TOKEN_ISSUER,
      useClass: JwtTokenIssuer,
    },
    {
      provide: LoginUseCase,
      useFactory: (
        users: UserRepository,
        passwordHasher: PasswordHasher,
        tokenIssuer: TokenIssuer,
      ) => new LoginUseCase(users, passwordHasher, tokenIssuer),
      inject: [USER_REPOSITORY, PASSWORD_HASHER, TOKEN_ISSUER],
    },
    {
      provide: GetCurrentUserUseCase,
      useFactory: (users: UserRepository) => new GetCurrentUserUseCase(users),
      inject: [USER_REPOSITORY],
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [TOKEN_ISSUER],
})
export class AuthModule {}
