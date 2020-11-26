import { OrganizationRepository, UserSession } from '@nest-starter/core';
import { IOrganizationEntity, MemberRoleEnum } from '@nest-starter/shared';
import { expect } from 'chai';
import { gql } from 'apollo-boost';

describe('Create Organization - /organizations (POST)', async () => {
  let session: UserSession;
  const organizationRepository = new OrganizationRepository();

  before(async () => {
    session = new UserSession();
    await session.initialize(true);
  });

  describe('Valid Creation', () => {
    it('should add the user as admin', async () => {
      const {
        data: { createOrganization: organization },
      } = await session.gql.mutate<{ createOrganization: IOrganizationEntity }>({
        mutation: gql`
          mutation CreateOrganization($body: CreateOrganizationDto!) {
            createOrganization(body: $body) {
              _id
              name
            }
          }
        `,
        variables: {
          body: {
            name: 'Test Org 2',
          },
        },
      });
      const dbOrganization = await organizationRepository.findById(organization._id);

      expect(dbOrganization.members.length).to.eq(1);
      expect(dbOrganization.members[0]._userId).to.eq(session.user._id);
      expect(dbOrganization.members[0].roles[0]).to.eq(MemberRoleEnum.ADMIN);
    });

    it('should create organization with correct name', async () => {
      const demoOrganization = {
        name: 'Hello Org',
      };
      const {
        data: { createOrganization: organization },
      } = await session.gql.mutate<{ createOrganization: IOrganizationEntity }>({
        mutation: gql`
          mutation CreateOrganization($body: CreateOrganizationDto!) {
            createOrganization(body: $body) {
              _id
              name
            }
          }
        `,
        variables: {
          body: demoOrganization,
        },
      });

      expect(organization.name).to.eq(demoOrganization.name);
    });
  });
});
