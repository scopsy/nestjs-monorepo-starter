import { UserSession } from '@nest-starter/core';
import { expect } from 'chai';
import { IOrganizationEntity, IUserEntity } from '@nest-starter/shared';
import { gql } from 'apollo-boost';
import { IGetMyOrganizationDto } from '../../../src/app/organization/dtos/get-my-organization.dto';

describe('Get my organization - /organizations/me (GET)', async () => {
  let session: UserSession;

  before(async () => {
    session = new UserSession();
    await session.initialize();
  });

  describe('Get organization profile', () => {
    let response: IGetMyOrganizationDto;

    before(async () => {
      const { body } = await session.testAgent.get('/v1/organizations/me').expect(200);
      response = body.data;
    });

    it('should return the correct organization', async () => {
      const {
        data: { currentOrganization },
      } = await session.gql.query<{ currentOrganization: IOrganizationEntity }>({
        query: gql`
          query GetMyOrganization {
            currentOrganization {
              _id
              name
            }
          }
        `,
      });

      expect(currentOrganization._id).to.eq(session.organization._id);
    });
  });
});
