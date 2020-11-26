import { MemberRoleEnum, MemberStatusEnum } from '@nest-starter/shared';
import * as faker from 'faker';
import { OrganizationRepository } from '../dal';

export class OrganizationService {
  private organizationRepository = new OrganizationRepository();
  async createOrganization() {
    const organization = await this.organizationRepository.create({
      logo: faker.image.avatar(),
      name: faker.company.companyName(),
    });

    return organization;
  }

  async addMember(organizationId: string, userId: string) {
    await this.organizationRepository.addMember(organizationId, {
      _userId: userId,
      roles: [MemberRoleEnum.ADMIN],
      memberStatus: MemberStatusEnum.ACTIVE,
    });
  }
}
