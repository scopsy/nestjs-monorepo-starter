import { OrganizationEntity, OrganizationRepository, UserSession } from '@nest-starter/core';
import { MemberRoleEnum } from '@nest-starter/shared';
import { expect } from 'chai';

describe('Create Organization - /organizations (POST)', async () => {
  let session: UserSession;
  const organizationRepository = new OrganizationRepository();

  before(async () => {
    session = new UserSession();
    await session.initialize(true);
  });

  describe('Wrong input', () => {
    it('should fail to create org without name', async () => {
      await session.testAgent
        .post('/v1/organizations')
        .send({
          taxIdentifier: '12312',
        })
        .expect(400);
    });
  });

  describe('Valid Creation', () => {
    let organization: OrganizationEntity;
    const demoOrganization = {
      name: 'Hello Org',
    };

    before(async () => {
      const { body } = await session.testAgent.post('/v1/organizations').send(demoOrganization).expect(201);

      organization = body.data;
    });

    it('should add the user as admin', async () => {
      const dbOrganization = await organizationRepository.findById(organization._id);

      expect(dbOrganization.members.length).to.eq(1);
      expect(dbOrganization.members[0]._userId).to.eq(session.user._id);
      expect(dbOrganization.members[0].roles[0]).to.eq(MemberRoleEnum.ADMIN);
    });

    it('should create organization with correct name', async () => {
      expect(organization.name).to.eq(demoOrganization.name);
    });
  });
});
