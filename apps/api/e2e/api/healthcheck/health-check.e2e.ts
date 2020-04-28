import { UserSession } from '@nest-starter/core';
import { expect } from 'chai';

describe('Health-check', () => {
  const session = new UserSession();

  before(async () => {
    await session.initialize();
  });

  describe('/health-check (GET)', () => {
    it('should correctly return a health check', async () => {
      const { body } = await session.testAgent
        .get('/health-check');

      expect(body.status).to.equal('ok');
    });
  });
});
