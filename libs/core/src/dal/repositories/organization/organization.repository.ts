import { IMemberInvite, MemberRoleEnum, MemberStatusEnum } from '@nest-starter/shared';
import { MemberEntity, OrganizationEntity } from './organization.entity';
import { BaseRepository } from '../base-repository';
import { Organization } from './organization.schema';

interface IAddMemberData {
  _userId?: string;
  roles: MemberRoleEnum[];
  invite?: IMemberInvite;
  memberStatus: MemberStatusEnum;
}

export class OrganizationRepository extends BaseRepository<OrganizationEntity> {
  constructor() {
    super(Organization, OrganizationEntity);
  }

  async removeMemberById(organizationId: string, memberId: string) {
    return await Organization.update(
      {
        _id: organizationId,
      },
      {
        $pull: {
          members: {
            _id: memberId,
          },
        },
      }
    );
  }

  async getOrganizationMembers(organizationId: string) {
    const organization = await Organization.findById(organizationId)
      .populate('members.user', 'firstName lastName email _id')
      .select('members');

    if (!organization) return [];

    const organizationEntity = this.mapEntity(organization);
    return organizationEntity.members;
  }

  async findUserActiveOrganizations(userId: string): Promise<OrganizationEntity[]> {
    return await this.find({
      members: {
        $elemMatch: {
          _userId: userId,
          memberStatus: MemberStatusEnum.ACTIVE,
        },
      },
    });
  }

  async convertInvitedUserToMember(
    token: string,
    data: {
      memberStatus: MemberStatusEnum;
      _userId: string;
      answerDate: Date;
    }
  ) {
    await this.update(
      {
        'members.invite.token': token,
      },
      {
        'members.$.memberStatus': data.memberStatus,
        'members.$._userId': data._userId,
        'members.$.invite.answerDate': data.answerDate,
      }
    );
  }

  async findOrganizationByInviteToken(token: string) {
    return await this.findOne({
      'members.invite.token': token,
    });
  }

  async findOrganizationsByMailBox(mailBoxId: string) {
    return await this.find({
      'members.mailBoxes': mailBoxId,
    });
  }

  async findInviteeByEmail(organizationId: string, email: string): Promise<MemberEntity> {
    const foundOrganization = await Organization.findOne(
      {
        _id: organizationId,
      },
      {
        _id: 1,
        members: {
          $elemMatch: {
            memberStatus: MemberStatusEnum.INVITED,
            'members.invite.email': email,
          },
        },
      }
    );

    if (!foundOrganization || !foundOrganization.members.length) return null;
    return foundOrganization.members[0];
  }

  async addMember(organizationId: string, member: IAddMemberData): Promise<void> {
    await Organization.update(
      {
        _id: organizationId,
      },
      {
        $push: {
          members: {
            _userId: member._userId,
            roles: member.roles,
            invite: member.invite,
            memberStatus: member.memberStatus,
          },
        },
      }
    );
  }

  async isMemberOfOrganization(organizationId: string, userId: string): Promise<boolean> {
    return !!(await Organization.findOne(
      {
        _id: organizationId,
        'members._userId': userId,
      },
      '_id'
    ));
  }

  async findMemberByUserId(organizationId: string, userId: string): Promise<MemberEntity> {
    const organization = await Organization.findOne(
      {
        _id: organizationId,
        'members._userId': userId,
      },
      {
        _id: 1,
        members: {
          $elemMatch: {
            _userId: userId,
          },
        },
      }
    );
    if (!organization) return null;

    const member = organization.members[0];
    if (!member) return null;

    return this.mapEntity(member) as never;
  }
}
