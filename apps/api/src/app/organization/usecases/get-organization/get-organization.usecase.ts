import { Injectable, Scope } from '@nestjs/common';
import { OrganizationRepository } from '@nest-starter/core';
import { GetOrganizationCommand } from './get-organization.command';

@Injectable({
  scope: Scope.REQUEST,
})
export class GetOrganization {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async execute(command: GetOrganizationCommand) {
    const organization = await this.organizationRepository.findById(command.id);

    return organization;
  }
}
