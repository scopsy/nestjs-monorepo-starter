import { DalService, testServer } from '@nest-starter/core';
import * as sinon from 'sinon';
import { bootstrap } from '../src/bootstrap';

const dalService = new DalService();
before(async () => {
  await testServer.create(await bootstrap());
  await dalService.connect(process.env.MONGO_URL);
});

after(async () => {
  await testServer.teardown();
  await dalService.destroy();
});

afterEach(() => {
  sinon.restore();
});
