import { UserSession } from '@nest-starter/core';
import { gql } from 'apollo-boost';
import { IUserEntity } from '@nest-starter/shared';
import { expect } from 'chai';

describe('User get my profile', async () => {
  let session: UserSession;

  before(async () => {
    session = new UserSession();
    await session.initialize();
  });

  it('should throw validation error for not enough information', async () => {
    const {
      data: { me },
    } = await session.gql.query<{ me: IUserEntity }>({
      query: gql`
        query GetMyProfile {
          me {
            _id
            firstName
            lastName
            email
          }
        }
      `,
    });

    expect(me._id).to.equal(session.user._id);
    expect(me.firstName).to.equal(session.user.firstName);
    expect(me.lastName).to.equal(session.user.lastName);
    expect(me.email).to.equal(session.user.email);
  });
});
