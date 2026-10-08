export const MEMBERSHIP_LOOKUP = Symbol('MEMBERSHIP_LOOKUP');

export interface MembershipRecord {
  id: string;
  userId: string;
  businessId: string;
  role: string;
  sharePercent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipLookup {
  businessExists(businessId: string): Promise<boolean>;
  findMembership(
    userId: string,
    businessId: string,
  ): Promise<MembershipRecord | null>;
}
