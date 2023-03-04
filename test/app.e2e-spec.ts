import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initTestApp } from './utils';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await initTestApp();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
