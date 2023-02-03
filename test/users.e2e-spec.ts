import {
  defaultGetAllResponse,
  getAllItemsWithPage2Size1,
  INVALID_ID,
  notFoundException,
  users,
} from './mockData';
import {
  AllUsersOutputModel,
  IUserOutputModel,
} from '../src/users/dto/users-output-models.dto';
import {
  initTestApp,
  createUserRequest,
  deleteUserRequest,
  getUsersRequest,
} from './utils';

describe('Users', () => {
  let app;
  let user1, user2, user3;

  beforeAll(async () => {
    app = await initTestApp();
  });

  it('/GET ALL all users', async () => {
    const response = await getUsersRequest(app);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(defaultGetAllResponse);
  });

  it('/POST create 3 users', async () => {
    const response1 = await createUserRequest(app).send(users[0]);
    expect(response1.status).toBe(201);
    user1 = response1.body;

    const response2 = await createUserRequest(app).send(users[1]);
    expect(response2.status).toBe(201);
    user2 = response2.body;

    const response3 = await createUserRequest(app).send(users[2]);
    expect(response3.status).toBe(201);
    user3 = response3.body;

    const response4 = await getUsersRequest(app);
    expect(response4.body.items).toHaveLength(3);
  });

  it('/GET ALL users with query Params', async () => {
    const response1 = await getUsersRequest(app).query({
      pageNumber: 2,
      pageSize: 1,
    });
    const expectedResult = getAllItemsWithPage2Size1<
      IUserOutputModel,
      AllUsersOutputModel
    >(user2);
    expect(response1.body).toEqual(expectedResult);

    const response2 = await getUsersRequest(app).query({
      searchLoginTerm: '3',
    });
    expect(response2.body.items).toHaveLength(1);
    expect(response2.body.items[0].id).toBe(user3.id);

    const response3 = await getUsersRequest(app).query({
      searchEmailTerm: '1',
    });
    expect(response3.body.items).toHaveLength(1);
    expect(response2.body.totalCount).toBe(1);
    expect(response3.body.items[0].id).toBe(user1.id);

    const response4 = await getUsersRequest(app).query({
      sortBy: 'login',
      sortDirection: 'asc',
    });
    expect(response4.body.items[0].id).toBe(user1.id);
    expect(response4.body.items[response4.body.items.length - 1].id).toBe(
      user3.id,
    );
  });

  it('/DELETE ONE delete user by invalid id', async () => {
    const response1 = await deleteUserRequest(app, INVALID_ID);
    expect(response1.status).toBe(404);
    expect(response1.body).toEqual(notFoundException);
  });

  it('/DELETE ONE delete user by valid id', async () => {
    const response1 = await deleteUserRequest(app, user2.id);
    expect(response1.status).toBe(204);

    const response2 = await getUsersRequest(app);
    expect(response2.body.items).toHaveLength(2);
    expect(response2.body.items).not.toContainEqual(user2);
  });

  afterAll(async () => {
    await app.close();
  });
});
