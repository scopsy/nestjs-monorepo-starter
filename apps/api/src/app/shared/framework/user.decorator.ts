import { createParamDecorator, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { GraphQLExecutionContext } from '@nestjs/graphql';

export const UserSession = createParamDecorator((data, ctx: GraphQLExecutionContext) => {
  let req;
  if (ctx.getType() === 'graphql') {
    req = ctx.getArgs()[2].req;
  } else {
    req = ctx.switchToHttp().getRequest();
  }

  if (req.user) return req.user;

  if (req.headers) {
    if (req.headers.authorization) {
      const tokenParts = req.headers.authorization.split(' ');
      if (tokenParts[0] !== 'Bearer') throw new UnauthorizedException('bad_token');
      if (!tokenParts[1]) throw new UnauthorizedException('bad_token');

      const user = jwt.decode(tokenParts[1]);
      return user;
    }
  }

  return null;
});
