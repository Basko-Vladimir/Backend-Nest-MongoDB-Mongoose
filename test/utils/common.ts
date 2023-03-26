import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { exceptionFactory } from '../../src/common/factories/exception.factory';
import { ServerErrorsFilter } from '../../src/common/filters/server-errors.filter';
import { HttpExceptionsFilter } from '../../src/common/filters/http-exceptions.filter';
import { useContainer } from 'class-validator';

export const initTestApp = async (): Promise<INestApplication> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory,
    }),
  );
  app.useGlobalFilters(new ServerErrorsFilter(), new HttpExceptionsFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.init();
  await clearDataBase(app);

  return app;
};

//Clear all Data Base
export const clearDataBase = (app: INestApplication) =>
  request(app.getHttpServer()).delete('/testing/all-data');
