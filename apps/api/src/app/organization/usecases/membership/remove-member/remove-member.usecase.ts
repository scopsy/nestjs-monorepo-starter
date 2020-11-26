import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { OrganizationRepository } from '@nest-starter/core';
import { RemoveMemberCommand } from './remove-member.command';
import { ApiException } from '../../../../shared/exceptions/api.exception';

@Injectable({
  scope: Scope.REQUEST,
})
export class RemoveMember {
  constructor(private organizationRepository: OrganizationRepository) {}

  async execute(command: RemoveMemberCommand) {
    const members = await this.organizationRepository.getOrganizationMembers(command.organizationId);
    const memberToRemove = members.find((i) => i._id === command.memberId);

    if (!memberToRemove) throw new NotFoundException('Member not found');
    if (memberToRemove._userId && memberToRemove._userId && memberToRemove._userId === command.userId) {
      throw new ApiException('Cannot remove self from members');
    }

    await this.organizationRepository.removeMemberById(command.organizationId, memberToRemove._id);

    return memberToRemove;
  }
}
