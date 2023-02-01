import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INVALID_ID, notFoundException, users } from './mockData';

describe('Users', () => {
  let app;
  let user1, user2, user3;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  const getUsersRequest = () => request(app.getHttpServer()).get('/users');
  const createUserRequest = () => request(app.getHttpServer()).post('/users');
  const deleteUserRequest = (userId: string) => {
    return request(app.getHttpServer()).delete(`/users/${userId}`);
  };

  it('/DELETE clear all database', async () => {
    const response1 = await request(app.getHttpServer()).delete(
      '/testing/all-data',
    );
    expect(response1.status).toBe(204);

    const response2 = await getUsersRequest();
    expect(response2.status).toBe(200);
    expect(response2.body.items).toHaveLength(0);
  });

  it('/GET ALL all users', async () => {
    const response = await getUsersRequest();

    expect(response.status).toBe(200);
    expect(response.body.pagesCount).toBe(0);
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(10);
    expect(response.body.totalCount).toBe(0);
    expect(response.body.items).toHaveLength(0);
  });

  it('/POST create 3 users', async () => {
    const response1 = await createUserRequest().send(users[0]);
    expect(response1.status).toBe(201);
    user1 = response1.body;

    const response2 = await createUserRequest().send(users[1]);
    expect(response2.status).toBe(201);
    user2 = response2.body;

    const response3 = await createUserRequest().send(users[2]);
    expect(response3.status).toBe(201);
    user3 = response3.body;

    const response4 = await getUsersRequest();
    expect(response4.body.items).toHaveLength(3);
  });

  it('/GET ALL users with query Params', async () => {
    const response1 = await getUsersRequest().query({
      pageNumber: 2,
      pageSize: 1,
    });
    expect(response1.body.items).toHaveLength(1);
    expect(response1.body.totalCount).toBe(3);
    expect(response1.body.pagesCount).toBe(3);
    expect(response1.body.page).toBe(2);
    expect(response1.body.pageSize).toBe(1);
    expect(response1.body.items[0].id).toBe(user2.id);

    const response2 = await getUsersRequest().query({
      searchLoginTerm: '3',
    });
    expect(response2.body.items).toHaveLength(1);
    expect(response2.body.items[0].id).toBe(user3.id);

    const response3 = await getUsersRequest().query({
      searchEmailTerm: '1',
    });
    expect(response3.body.items).toHaveLength(1);
    expect(response2.body.totalCount).toBe(1);
    expect(response3.body.items[0].id).toBe(user1.id);

    const response4 = await getUsersRequest().query({
      sortBy: 'login',
      sortDirection: 'asc',
    });
    expect(response4.body.items[0].id).toBe(user1.id);
    expect(response4.body.items[response4.body.items.length - 1].id).toBe(
      user3.id,
    );
  });

  it('/DELETE ONE delete user by invalid id', async () => {
    const response1 = await deleteUserRequest(INVALID_ID);
    expect(response1.status).toBe(404);
    expect(response1.body).toEqual(notFoundException);
  });

  it('/DELETE ONE delete user by valid id', async () => {
    const response1 = await deleteUserRequest(user2.id);
    expect(response1.status).toBe(204);

    const response2 = await getUsersRequest();
    expect(response2.body.items).toHaveLength(2);
    expect(response2.body.items).not.toContainEqual(user2);
  });

  afterAll(async () => {
    await app.close();
  });
});
