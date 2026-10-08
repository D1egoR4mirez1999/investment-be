export class BusinessMemberResponseDto {
  userId!: string;
  name!: string;
  email!: string;
  role!: string;
  sharePercent!: number;
}

export class BusinessResponseDto {
  id!: string;
  name!: string;
  role!: string;
  sharePercent!: number;
  totalInvestmentCents!: number;
  members!: BusinessMemberResponseDto[];
}
