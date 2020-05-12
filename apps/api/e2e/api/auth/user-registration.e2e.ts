import { UserSession } from '@nest-starter/core';
import * as jwt from 'jsonwebtoken';
import { expect } from 'chai';
import { IJwtPayload } from '@nest-starter/shared/src';

describe('User registration - /auth/register (POST)', async () => {
  let session: UserSession;

  before(async () => {
    session = new UserSession();
    await session.initialize();
  });

  it('should throw validation error for not enough information', async () => {
    const { body } = await session.testAgent.post('/v1/auth/register').send({
      email: '123',
    });

    expect(body.statusCode).to.equal(400);
    expect(body.message.find((i) => i.includes('email'))).to.be.ok;
    expect(body.message.find((i) => i.includes('password'))).to.be.ok;
    expect(body.message.find((i) => i.includes('firstName'))).to.be.ok;
    expect(body.message.find((i) => i.includes('lastName'))).to.be.ok;
  });

  it('should create a new user successfully', async () => {
    const { body } = await session.testAgent.post('/v1/auth/register').send({
      email: 'Testy.test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      password: '123456789',
    });

    expect(body.data).to.be.ok;

    const jwtContent = ((await jwt.decode(body.data)) as unknown) as IJwtPayload;

    expect(jwtContent.firstName).to.equal('test');
    expect(jwtContent.lastName).to.equal('user');
    expect(jwtContent.email).to.equal('testytest@gmail.com');
  });

  it('should throw error when registering same user twice', async () => {
    const { body } = await session.testAgent.post('/v1/auth/register').send({
      email: 'Testy.test@gmail.com',
      firstName: 'Test',
      lastName: 'User',
      password: '123456789',
    });

    expect(body.message).to.contain('User already exists');
  });
});
