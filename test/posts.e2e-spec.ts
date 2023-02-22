import { INestApplication } from '@nestjs/common';
import {
  blogs,
  INVALID_ID,
  posts,
  auth,
  defaultResponses,
  errors,
} from './mockData';
import {
  initTestApp,
  createBlogsRequest,
  createPostRequest,
  deletePostRequest,
  getBlogsRequest,
  getCommentsByPostIdRequest,
  getPostRequest,
  getPostsRequest,
  updatePostRequest,
  getPostsByBlogIdRequest,
  clearDataBase,
  getBlogRequest,
  updateBlogRequest,
  deleteBlogRequest,
} from './utils';
import {
  AllPostsOutputModel,
  IPostOutputModel,
} from '../src/posts/dto/posts-output-models.dto';
import {
  AllBlogsOutputModel,
  IBlogOutputModel,
} from '../src/blogs/dto/blogs-output-models.dto';

describe('Posts', () => {
  const { correctCreateBlogDtos, incorrectBlogsIds } = blogs;
  const { notFoundException } = errors;
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
  const { getAllItemsWithPage2Size1, defaultGetAllResponse } = defaultResponses;
  let app: INestApplication;
  let post1, post2, post3;
  let blog1, blog2;

  beforeAll(async () => {
    app = await initTestApp();
    ``;
    postsBadQueryResponse.errorsMessages.push({
      message: expect.any(String),
      field: 'blogId',
    });
  });

  describe('/(CREATE POST) create post', () => {
    it('incorrect auth credentials or without them', async () => {
      const response1 = await createPostRequest(app).send(
        correctCreatePostDtos[0],
      );
      expect(response1.status).toBe(401);

      const response2 = await createBlogsRequest(app)
        .set(incorrectBasicCredentials)
        .send(correctCreatePostDtos[0]);
      expect(response2.status).toBe(401);
    });

    it('correct auth credentials and incorrect input data', async () => {
      for (let i = 0; i <= incorrectPostsDtos.length; i++) {
        const response = await createPostRequest(app)
          .set(correctBasicCredentials)
          .send({ ...incorrectPostsDtos[i], blogId: incorrectBlogsIds[i] });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(postsBadQueryResponse);
      }
    });

    it('correct auth credentials and correct input data', async () => {
      const response1 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogDtos[0]);
      expect(response1.status).toBe(201);
      blog1 = response1.body;
      const blogId = blog1.id;
      const savedPosts = [post1, post2, post3];

      for (let i = 0; i < correctCreatePostDtos.length; i++) {
        const result = await createPostRequest(app)
          .set(correctBasicCredentials)
          .send({ ...correctCreatePostDtos[i], blogId });
        expect(result.status).toBe(201);
        expect(result.body).toEqual(
          getCreatedPostItem(correctCreatePostDtos[i], blog1),
        );
        savedPosts[i] = result.body;
      }
      [post1, post2, post3] = savedPosts;

      const response2 = await getPostsRequest(app);
      expect(response2.body.items).toHaveLength(3);
    });
  });

  describe('/(GET All POSTS) get all posts', () => {
    it('with query Params', async () => {
      const response1 = await getPostsRequest(app).query({
        pageNumber: 2,
        pageSize: 1,
      });
      const expectedResult = getAllItemsWithPage2Size1<
        IPostOutputModel,
        AllPostsOutputModel
      >(post2);
      expect(response1.body).toEqual(expectedResult);

      const response2 = await getPostsByBlogIdRequest(app, blog1.id).query({
        sortBy: 'content',
        sortDirection: 'asc',
      });
      expect(response2.body.items[0].id).toBe(post1.id);
      expect(response2.body.items[response2.body.items.length - 1].id).toBe(
        post3.id,
      );
    });

    it('by default without created posts', async () => {
      await clearDataBase(app);

      const response = await getPostsRequest(app);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(defaultGetAllResponse);
    });
  });

  describe('/(GET ONE POST) get one post', () => {
    it('by invalid id', async () => {
      const response1 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogDtos[0]);
      expect(response1.status).toBe(201);
      blog1 = response1.body;

      const response2 = await createPostRequest(app)
        .set(correctBasicCredentials)
        .send({ ...correctCreatePostDtos[0], blogId: blog1.id });
      expect(response2.status).toBe(201);
      post1 = response2.body;

      const response3 = await getPostRequest(app, INVALID_ID);
      expect(response3.status).toBe(404);
    });

    it('by valid id', async () => {
      const response = await getPostRequest(app, post1.id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(post1);
    });
  });

  describe('/(UPDATE ONE POST) update post', () => {
    it('incorrect auth credentials or without them', async () => {
      const response1 = await updatePostRequest(app, post1.id).send(
        correctUpdatePostDto,
      );
      expect(response1.status).toBe(401);

      const response2 = await updatePostRequest(app, post1.id)
        .set(incorrectBasicCredentials)
        .send({ ...correctUpdatePostDto, blogId: blog1.id });
      expect(response2.status).toBe(401);
    });

    it('correct auth credentials but invalid id', async () => {
      const response = await updatePostRequest(app, INVALID_ID)
        .set(correctBasicCredentials)
        .send({ ...correctUpdatePostDto, blogId: blog1.id });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct auth credentials, valid id but incorrect input data', async () => {
      for (let i = 0; i < incorrectPostsDtos.length; i++) {
        const response = await updatePostRequest(app, post1.id)
          .set(correctBasicCredentials)
          .send({ ...incorrectPostsDtos[i], blogId: incorrectBlogsIds[i] });
        expect(response.status).toBe(400);
        expect(response.body).toEqual(postsBadQueryResponse);
      }
    });

    it('correct all (auth credentials, id, input data)', async () => {
      const response1 = await updatePostRequest(app, post1.id)
        .set(correctBasicCredentials)
        .send({ ...correctUpdatePostDto, blogId: blog1.id });
      expect(response1.status).toBe(204);

      const response2 = await getPostRequest(app, post1.id);
      expect(response2.body).toEqual({
        ...post1,
        ...correctUpdatePostDto,
      });
    });
  });

  describe('/(DELETE ONE POST) delete blog', () => {
    it('incorrect auth credentials or without them', async () => {
      const response1 = await deletePostRequest(app, post1.id);
      expect(response1.status).toBe(401);

      const response2 = await deleteBlogRequest(app, blog1.id).set(
        incorrectBasicCredentials,
      );
      expect(response2.status).toBe(401);
    });

    it('correct auth credentials but invalid id', async () => {
      const response = await deletePostRequest(app, INVALID_ID).set(
        correctBasicCredentials,
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct auth credentials and valid id', async () => {
      const response = await deletePostRequest(app, post1.id).set(
        correctBasicCredentials,
      );
      expect(response.status).toBe(204);

      const response2 = await getPostRequest(app, post1.id);
      expect(response2.status).toBe(404);
      expect(response2.body).toEqual(notFoundException);
    });
  });

  //
  // it('GET ALL get comments for post by invalid postId', async () => {
  //   const response = await getCommentsByPostIdRequest(app, INVALID_ID);
  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual(notFoundException);
  // });
  //
  // it('GET All get comments for post by valid postId', async () => {
  //   const response = await getCommentsByPostIdRequest(app, post2.id);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(defaultGetAllResponse);
  // });

  afterAll(async () => {
    await app.close();
  });
});
