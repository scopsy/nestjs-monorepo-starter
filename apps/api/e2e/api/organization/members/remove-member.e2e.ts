import { MemberEntity, OrganizationRepository, UserSession } from '@nest-starter/core';
import { MemberRoleEnum, MemberStatusEnum } from '@nest-starter/shared';
import { expect } from 'chai';
import { describe } from 'mocha';

describe('Remove organization member - /organizations/members/:memberId (DELETE)', async () => {
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

    user2.organization = session.organization;
    user3.organization = session.organization;
  });

  it('should remove the member by his id', async () => {
    const members: MemberEntity[] = await getOrganizationMembers();
    const user2Member = members.find((i) => i._userId === user2.user._id);

    const { body } = await session.testAgent.delete(`/v1/organizations/members/${user2Member._id}`).expect(200);

    expect(body.data._id).to.equal(user2Member._id);

    const membersAfterRemoval: MemberEntity[] = await getOrganizationMembers();
    const user2Removed = membersAfterRemoval.find((i) => i._userId === user2.user._id);
    expect(user2Removed).to.not.be.ok;
  });

  it('should throw error while trying to remove self', async () => {
    const members: MemberEntity[] = await getOrganizationMembers();
    const masterUser = members.find((i) => i._userId === session.user._id);

    const { body } = await session.testAgent.delete(`/v1/organizations/members/${masterUser._id}`).expect(400);

    expect(body.message.toLowerCase()).to.contain('cannot remove self');
  });

  async function getOrganizationMembers() {
    const { body } = await session.testAgent.get('/v1/organizations/members');

    return body.data;
  }
});
