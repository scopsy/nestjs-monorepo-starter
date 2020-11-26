import { UserSession } from '@nest-starter/core';
import { expect } from 'chai';
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
      expect(response._id).to.eq(session.organization._id);
    });
  });
});
