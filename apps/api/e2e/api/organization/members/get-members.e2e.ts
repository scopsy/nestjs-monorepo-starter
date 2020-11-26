import { MemberEntity, OrganizationRepository, UserSession } from '@nest-starter/core';
import { IOrganizationEntity, MemberRoleEnum, MemberStatusEnum } from '@nest-starter/shared';
import { expect } from 'chai';
import { describe } from 'mocha';
import { gql } from 'apollo-boost';

describe('Get Organization members - /organizations/members (GET)', async () => {
  let session: UserSession;
  const organizationRepository = new OrganizationRepository();
  let user2: UserSession;
  let user3: UserSession;

  beforeEach(async () => {
    session = new UserSession();
    await session.initialize();

    user2 = new UserSession();
    await user2.initialize(true);

    user3 = new UserSession();
    await user3.initialize(true);
  });

  it('should return all organization members', async () => {
    await organizationRepository.addMember(session.organization._id, {
      _userId: user2.user._id,
      invite: null,
      roles: [MemberRoleEnum.ADMIN],
      memberStatus: MemberStatusEnum.ACTIVE,
    });

    await organizationRepository.addMember(session.organization._id, {
      _userId: user3.user._id,
      invite: null,
      roles: [MemberRoleEnum.ADMIN],
      memberStatus: MemberStatusEnum.ACTIVE,
    });

    const {
      data: {
        currentOrganization: { members },
      },
    } = await session.gql.query<{ currentOrganization: IOrganizationEntity }>({
      query: gql`
        query GetMembers {
          currentOrganization {
            _id
            name
            members {
              _id
              _userId
              memberStatus
              user {
                _id
                email
                firstName
              }
            }
          }
        }
      `,
    });

    const response: MemberEntity[] = members;

    expect(response.length).to.equal(3);
    const user2Member = response.find((i) => i._userId === user2.user._id);

    expect(user2Member).to.be.ok;
    expect(user2Member.memberStatus).to.equal(MemberStatusEnum.ACTIVE);
    expect(user2Member.user).to.be.ok;
    expect(user2Member.user.firstName).to.equal(user2.user.firstName);
    expect(user2Member.user.email).to.equal(user2.user.email);
  });
});
