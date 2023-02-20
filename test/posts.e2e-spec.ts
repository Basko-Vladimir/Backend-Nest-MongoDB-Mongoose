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
  const { correctCreateBlogDtos } = blogs;
  const {
    correctCreatePostDtos,
    incorrectPostsDtos,
    postsBadQueryResponse,
    getCreatedPostItem,
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
  });

  describe('/(POST) create post', () => {
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
      const incorrectBlogsIds = ['', '   ', '2156165465', INVALID_ID];
      postsBadQueryResponse.errorsMessages.push({
        message: expect.any(String),
        field: 'blogId',
      });

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

  describe('/(GET All) get all posts', () => {
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

  describe('/(GET ONE) get one post', () => {
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

  // it('/GET ALL get all posts', async () => {
  //   const response = await getPostsRequest(app);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(defaultGetAllResponse);
  // });
  //
  // it('/GET ALL posts with query Params', async () => {
  //   const response1 = await getPostsRequest(app).query({
  //     pageNumber: 2,
  //     pageSize: 1,
  //   });
  //   const expectedResult = getAllItemsWithPage2Size1<
  //     IPostOutputModel,
  //     AllPostsOutputModel
  //   >(post2);
  //   expect(response1.body).toEqual(expectedResult);
  //
  //   const response3 = await getPostsRequest(app).query({
  //     sortBy: 'title',
  //     sortDirection: 'asc',
  //   });
  //   expect(response3.body.items[0].id).toBe(post1.id);
  //   expect(response3.body.items[response3.body.items.length - 1].id).toBe(
  //     post3.id,
  //   );
  // });
  //
  // it('/GET ONE get one post by invalid id', async () => {
  //   const response = await getPostRequest(app, INVALID_ID);
  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual(notFoundException);
  // });
  //
  // it('/GET ONE get one post by id', async () => {
  //   const response = await getPostRequest(app, post2.id);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(post2);
  // });
  //
  // it('/UPDATE ONE update post by invalid id', async () => {
  //   const response = await updatePostRequest(app, INVALID_ID).send(
  //     updatedPostData,
  //   );
  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual(notFoundException);
  // });
  //
  // it('/UPDATE ONE update post by valid id', async () => {
  //   const response1 = await updatePostRequest(app, post2.id).send({
  //     ...updatedPostData,
  //     blogId: blog1.id,
  //   });
  //   expect(response1.status).toBe(204);
  //
  //   const response2 = await getPostRequest(app, post2.id);
  //   expect(response2.body).toEqual({
  //     ...post2,
  //     ...updatedPostData,
  //   });
  // });
  //
  // it('/DELETE ONE delete post by invalid id', async () => {
  //   const response = await deletePostRequest(app, INVALID_ID);
  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual(notFoundException);
  // });
  //
  // it('/DELETE ONE delete post by valid id', async () => {
  //   const response = await deletePostRequest(app, post1.id);
  //   expect(response.status).toBe(204);
  //
  //   const response2 = await deletePostRequest(app, post1.id);
  //   expect(response2.status).toBe(404);
  //   expect(response2.body).toEqual(notFoundException);
  // });
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
