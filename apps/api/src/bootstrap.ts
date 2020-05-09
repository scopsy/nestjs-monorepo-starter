import './config';

import { INestApplication, ValidationPipe, Logger } from '@nestjs/common';
import * as passport from 'passport';
import * as compression from 'compression';
import { NestFactory, Reflector } from '@nestjs/core';

import * as Sentry from '@sentry/node';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './app/shared/framework/response.interceptor';
import { RolesGuard } from './app/auth/framework/roles.guard';

if (process.env.SENTRY_DSN && process.env.NODE_ENV === 'prod') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}

export async function bootstrap(): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.NODE_ENV === 'dev' ? '*' : [process.env.FRONT_BASE_URL],
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  app.setGlobalPrefix('v1');

  app.use(passport.initialize());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalGuards(new RolesGuard(app.get(Reflector)));
  app.use(compression());

  if (process.env.NODE_ENV === 'dev') {
    const options = new DocumentBuilder()
      .setTitle('nest-starter API')
      .setDescription('The nest-starter API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT);

  Logger.log(`Started application in NODE_ENV=${process.env.NODE_ENV} port ${process.env.PORT}`);
  return app;
}
