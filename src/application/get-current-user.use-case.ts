import { UserNotFoundError } from '../domain/shared/domain-error.js';
import type {
  UserPublicView,
  UserRepository,
} from '../domain/ports/user.repository.js';

export class GetCurrentUserUseCase {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string): Promise<UserPublicView> {
    const user = await this.users.findPublicById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }
    return user;
  }
}
