import {
  auth,
  blogs,
  comments,
  defaultResponses,
  errors,
  INVALID_ID,
  posts,
  users,
} from './mockData';
import { INestApplication } from '@nestjs/common';
import {
  createBlogsRequest,
  createCommentByPostIdRequest,
  createPostRequest,
  createUserRequest,
  deleteBlogRequest,
  deleteCommentRequest,
  deletePostRequest,
  getCommentRequest,
  getPostRequest,
  initTestApp,
  loginRequest,
  registrationRequest,
  updateCommentRequest,
  updatePostRequest,
} from './utils';

describe('Comments', () => {
  const { correctCreateBlogDtos, incorrectBlogsIds } = blogs;
  const { notFoundException, unauthorisedException } = errors;
  const {
    correctCreatePostDtos,
    incorrectPostsDtos,
    postsBadQueryResponse,
    getCreatedPostItem,
    correctUpdatePostDto,
  } = posts;
  const {
    correctBasicCredentials,
    incorrectBasicCredentials,
    incorrectAccessToken,
  } = auth;
  const {
    correctCreateCommentDtos,
    commentsBadQueryResponse,
    incorrectCommentsDtos,
    correctUpdateCommentDtos,
    getCreatedCommentItem,
  } = comments;
  const { correctCreateUserDtos } = users;
  const { getAllItemsWithPage2Size1, defaultGetAllResponse } = defaultResponses;
  let app: INestApplication;
  let post1, post2, post3;
  let comment1, comment2;
  let blog1;
  let user1;
  let user1Token;

  beforeAll(async () => {
    app = await initTestApp();
  });

  describe('Preparing data', () => {
    it('User creating', async () => {
      const response1 = await createUserRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateUserDtos[0]);
      expect(response1.status).toBe(201);
      user1 = response1.body;
    });

    it('User login', async () => {
      const response = await loginRequest(app).send({
        loginOrEmail: correctCreateUserDtos[0].login,
        password: correctCreateUserDtos[0].password,
      });
      expect(response.status).toBe(200);
      user1Token = `Bearer ${response.body.accessToken}`;
    });

    it('Blog creating', async () => {
      const response = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogDtos[0]);
      expect(response.status).toBe(201);
      blog1 = response.body;
    });

    it('Post creating', async () => {
      const response = await createPostRequest(app)
        .set(correctBasicCredentials)
        .send({ ...correctCreatePostDtos[0], blogId: blog1.id });
      expect(response.status).toBe(201);
      post1 = response.body;
    });

    it('Comment creating', async () => {
      const response = await createCommentByPostIdRequest(app, post1.id)
        .set({ Authorization: user1Token })
        .send(correctCreateCommentDtos[0]);
      expect(response.status).toBe(201);
      comment1 = response.body;
    });
  });

  describe('/(GET ONE COMMENT) get one comment', () => {
    it('by invalid id', async () => {
      const response3 = await getCommentRequest(app, INVALID_ID);
      expect(response3.status).toBe(404);
    });

    it('by valid id', async () => {
      const response3 = await getCommentRequest(app, comment1.id);
      expect(response3.status).toBe(200);
      expect(response3.body).toEqual(
        getCreatedCommentItem(comment1.content, correctCreateUserDtos[0].login),
      );
    });
  });

  describe('/(UPDATE ONE COMMENT)', () => {
    it('incorrect token or without it', async () => {
      const response1 = await updateCommentRequest(app, post1.id).send(
        correctUpdatePostDto,
      );
      expect(response1.status).toBe(401);

      const response2 = await updateCommentRequest(app, post1.id)
        .set({ Authorization: incorrectAccessToken })
        .send(correctUpdateCommentDtos);
      expect(response2.status).toBe(401);
    });

    it('correct token but invalid id', async () => {
      const response = await updateCommentRequest(app, INVALID_ID)
        .set({ Authorization: user1Token })
        .send(correctUpdateCommentDtos);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct token, valid id but incorrect input data', async () => {
      for (let i = 0; i < incorrectCommentsDtos.length; i++) {
        const response = await updateCommentRequest(app, comment1.id)
          .set({ Authorization: user1Token })
          .send(incorrectCommentsDtos[i]);
        expect(response.status).toBe(400);
        expect(response.body).toEqual(commentsBadQueryResponse);
      }
    });

    it('correct all (token, id, input data)', async () => {
      const response1 = await updateCommentRequest(app, comment1.id)
        .set({ Authorization: user1Token })
        .send(correctCreateCommentDtos[0]);
      expect(response1.status).toBe(204);

      const response2 = await getCommentRequest(app, comment1.id);
      expect(response2.body).toEqual(
        getCreatedCommentItem(comment1.content, correctCreateUserDtos[0].login),
      );
    });
  });

  describe('/(DELETE ONE COMMENT) delete one comment', () => {
    it('incorrect token or without it', async () => {
      const response1 = await deleteCommentRequest(app, comment1.id);
      expect(response1.status).toBe(401);

      const response2 = await deleteCommentRequest(app, comment1.id).set({
        Authorization: incorrectAccessToken,
      });
      expect(response2.status).toBe(401);
    });

    it('correct token but invalid id', async () => {
      const response = await deleteCommentRequest(app, INVALID_ID).set({
        Authorization: user1Token,
      });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct token and valid id', async () => {
      const response = await deleteCommentRequest(app, comment1.id).set({
        Authorization: user1Token,
      });
      expect(response.status).toBe(204);

      const response2 = await getCommentRequest(app, comment1.id);
      expect(response2.status).toBe(404);
      expect(response2.body).toEqual(notFoundException);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
