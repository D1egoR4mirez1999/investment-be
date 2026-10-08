import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { PasswordHasher } from '../../domain/ports/password-hasher.js';

@Injectable()
export class BcryptPasswordHasher implements PasswordHasher {
  compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
