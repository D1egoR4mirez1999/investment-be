import { BusinessNotFoundError } from '../domain/shared/domain-error.js';
import type {
  BusinessRepository,
  BusinessView,
} from '../domain/ports/business.repository.js';

export class GetBusinessUseCase {
  constructor(private readonly businesses: BusinessRepository) {}

  async execute(userId: string, businessId: string): Promise<BusinessView> {
    const business = await this.businesses.findOneForUser(userId, businessId);
    if (!business) {
      throw new BusinessNotFoundError();
    }
    return business;
  }
}
