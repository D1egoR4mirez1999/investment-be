import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetBusinessUseCase } from '../../application/get-business.use-case.js';
import { ListBusinessesUseCase } from '../../application/list-businesses.use-case.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { JwtPayload } from '../auth/types/auth.types.js';
import { BusinessResponseDto } from './dto/business-response.dto.js';
import { BusinessMembershipGuard } from './guards/business-membership.guard.js';

@ApiTags('Businesses')
@ApiBearerAuth()
@Controller('businesses')
export class BusinessesController {
  constructor(
    private readonly listBusinessesUseCase: ListBusinessesUseCase,
    private readonly getBusinessUseCase: GetBusinessUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List businesses for the authenticated user' })
  @ApiOkResponse({ type: BusinessResponseDto, isArray: true })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  findAll(@CurrentUser() user: JwtPayload): Promise<BusinessResponseDto[]> {
    return this.listBusinessesUseCase.execute(user.sub);
  }

  @Get(':id')
  @UseGuards(BusinessMembershipGuard)
  @ApiOperation({ summary: 'Get a business by id' })
  @ApiOkResponse({ type: BusinessResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiForbiddenResponse({ description: 'User is not a member of this business' })
  @ApiNotFoundResponse({ description: 'Business not found' })
  findOne(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ): Promise<BusinessResponseDto> {
    return this.getBusinessUseCase.execute(user.sub, id);
  }
}
