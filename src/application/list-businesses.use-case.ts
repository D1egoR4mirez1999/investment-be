import type {
  BusinessRepository,
  BusinessView,
} from '../domain/ports/business.repository.js';

export class ListBusinessesUseCase {
  constructor(private readonly businesses: BusinessRepository) {}

  async execute(userId: string): Promise<BusinessView[]> {
    return this.businesses.findAllForUser(userId);
  }
}
