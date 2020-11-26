import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IJwtPayload, MemberRoleEnum } from '@nest-starter/shared';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/framework/gql-auth.guard';
import { UserSession } from '../shared/framework/user.decorator';
import { GetMyOrganization } from './usecases/get-my-organization/get-my-organization.usecase';
import { GetMyOrganizationCommand } from './usecases/get-my-organization/get-my-organization.command';
import { Organization } from './organization.graph';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { CreateOrganization } from './usecases/create-organization/create-organization.usecase';
import { CreateOrganizationCommand } from './usecases/create-organization/create-organization.command';
import { GetMembers } from './usecases/membership/get-members/get-members.usecase';
import { GetMembersCommand } from './usecases/membership/get-members/get-members.command';
import { Member } from './member.graph';

@Resolver((of) => Organization)
@UseGuards(GqlAuthGuard)
export class OrganizationResolver {
  constructor(
    private getMyOrganizationUsecase: GetMyOrganization,
    private createOrganizationUsecase: CreateOrganization,
    private getMembers: GetMembers
  ) {}

  @Mutation((returns) => Organization)
  async createOrganization(@UserSession() user: IJwtPayload, @Args('body') body: CreateOrganizationDto) {
    const command = CreateOrganizationCommand.create({
      userId: user._id,
      logo: body.logo,
      name: body.name,
    });
    const organization = await this.createOrganizationUsecase.execute(command);

    return organization;
  }

  @Query((returns) => Organization)
  async currentOrganization(@UserSession() user: IJwtPayload) {
    const command = GetMyOrganizationCommand.create({
      userId: user._id,
      id: user.organizationId,
    });

    return await this.getMyOrganizationUsecase.execute(command);
  }

  @ResolveField((returns) => [Member])
  async members(@Parent() organization: Organization, @UserSession() user: IJwtPayload) {
    return await this.getMembers.execute(
      GetMembersCommand.create({
        userId: user._id,
        organizationId: user.organizationId,
      })
    );
  }
}
