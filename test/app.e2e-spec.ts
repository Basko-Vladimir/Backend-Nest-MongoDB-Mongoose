import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { initTestApp } from './utils/common';

describe('AppController (e2e)', () => {
  jest.setTimeout(20 * 1000);
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
