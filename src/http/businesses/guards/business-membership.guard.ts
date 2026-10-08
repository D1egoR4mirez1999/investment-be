import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  MEMBERSHIP_LOOKUP,
  type MembershipLookup,
  type MembershipRecord,
} from '../../../domain/ports/membership.lookup.js';
import type { AuthenticatedRequest } from '../../auth/types/auth.types.js';

export interface MembershipRequest extends AuthenticatedRequest {
  membership: MembershipRecord;
}

@Injectable()
export class BusinessMembershipGuard implements CanActivate {
  constructor(
    @Inject(MEMBERSHIP_LOOKUP)
    private readonly membershipLookup: MembershipLookup,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<MembershipRequest>();
    const rawBusinessId = request.params.id ?? request.params.businessId;
    const businessId = Array.isArray(rawBusinessId)
      ? rawBusinessId[0]
      : rawBusinessId;

    if (!businessId) {
      throw new ForbiddenException('Business id is required');
    }

    const exists = await this.membershipLookup.businessExists(businessId);
    if (!exists) {
      throw new NotFoundException('Business not found');
    }

    const membership = await this.membershipLookup.findMembership(
      request.user.sub,
      businessId,
    );

    if (!membership) {
      throw new ForbiddenException('You are not a member of this business');
    }

    request.membership = membership;
    return true;
  }
}
