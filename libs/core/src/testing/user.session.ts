import 'cross-fetch/polyfill';
import * as faker from 'faker';
import { SuperTest, Test } from 'supertest';
import * as request from 'supertest';
import * as defaults from 'superagent-defaults';
import ApolloClient from 'apollo-boost';

import { UserEntity, UserRepository } from '../dal/repositories/user';
import { testServer } from './test-server.service';

export class UserSession {
  private userRepository = new UserRepository();

  token: string;

  user: UserEntity;

  testAgent: SuperTest<Test>;

  testServer = testServer;

  gql = new ApolloClient({
    uri: `http://localhost:${process.env.PORT}/graphql`,
    request: (operation) => {
      if (this.token) {
        operation.setContext({
          headers: {
            Authorization: `${this.token}`,
          },
        });
      }
    },
  });

  constructor(private options: {} = {}) {}

  async initialize() {
    const card = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };

    this.user = await this.userRepository.create({
      lastName: card.lastName,
      firstName: card.firstName,
      email: faker.internet.email(card.firstName, card.lastName),
      profilePicture: faker.image.avatar(),
      tokens: [],
    });

    const { body } = await request(
      this.testServer ? this.testServer.getHttpServer() : `http://localhost:${process.env.PORT}`
    ).get(`/v1/auth/test/token/${this.user._id}`);

    this.token = `Bearer ${body.data}`;

    if (this.testServer) {
      this.testAgent = defaults(request(this.testServer.getHttpServer())).set('Authorization', this.token);
    }
  }
}
