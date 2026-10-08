export const BUSINESS_REPOSITORY = Symbol('BUSINESS_REPOSITORY');

export interface BusinessMemberView {
  userId: string;
  name: string;
  email: string;
  role: string;
  sharePercent: number;
}

export interface BusinessView {
  id: string;
  name: string;
  role: string;
  sharePercent: number;
  totalInvestmentCents: number;
  members: BusinessMemberView[];
}

export interface BusinessRepository {
  findAllForUser(userId: string): Promise<BusinessView[]>;
  findOneForUser(userId: string, businessId: string): Promise<BusinessView | null>;
}
