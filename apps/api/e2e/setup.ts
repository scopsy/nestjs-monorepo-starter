import { DalService, testServer } from '@nest-starter/core';
import { bootstrap } from '../src/bootstrap';
import * as sinon from 'sinon';

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
