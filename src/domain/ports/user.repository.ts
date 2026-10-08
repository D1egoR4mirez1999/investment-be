export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserPublicView {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findPublicById(userId: string): Promise<UserPublicView | null>;
}
