import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { OrganizationRepository } from '@nest-starter/core';
import { GetMembersCommand } from './get-members.command';

@Injectable({
  scope: Scope.REQUEST,
})
export class GetMembers {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(command: GetMembersCommand) {
    return await this.organizationRepository.getOrganizationMembers(command.organizationId);
  }
}
