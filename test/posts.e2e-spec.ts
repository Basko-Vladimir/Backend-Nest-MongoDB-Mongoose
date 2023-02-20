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
} from './utils';
import {
  AllPostsOutputModel,
  IPostOutputModel,
} from '../src/posts/dto/posts-output-models.dto';

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
  const {} = errors;
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

    // it('correct auth credentials and correct input data', async () => {
    //   const response1 = await createBlogsRequest(app)
    //     .set(correctBasicCredentials)
    //     .send(correctCreateBlogDtos[0]);
    //   expect(response1.status).toBe(201);
    //   blog1 = response1.body;
    //   const blogId = blog1.id;
    //
    //   const response2 = await createPostRequest(app)
    //     .set(correctBasicCredentials)
    //     .send({ ...correctCreatePostDtos[0], blogId });
    //   expect(response2.status).toBe(201);
    //   expect(response2.body).toEqual(
    //     getCreatedPostItem(correctCreatePostDtos[0], blogId),
    //   );
    //   post1 = response2.body;
    //
    //   const response3 = await createPostRequest(app)
    //     .set(correctBasicCredentials)
    //     .send({ ...correctCreatePostDtos[1], blogId });
    //   expect(response3.status).toBe(201);
    //   expect(response3.body).toEqual(
    //     getCreatedPostItem(correctCreatePostDtos[1], blogId),
    //   );
    //   post2 = response3.body;
    //
    //   const response4 = await createPostRequest(app)
    //     .set(correctBasicCredentials)
    //     .send({ ...correctCreatePostDtos[2], blogId });
    //   expect(response4.status).toBe(201);
    //   expect(response4.body).toEqual(
    //     getCreatedPostItem(correctCreatePostDtos[2], blogId),
    //   );
    //   post3 = response4.body;
    //
    //   const response5 = await getPostsRequest(app);
    //   expect(response5.body.items).toHaveLength(3);
    // });
  });

  // it('/GET ALL get all posts', async () => {
  //   const response = await getPostsRequest(app);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(defaultGetAllResponse);
  // });
  //
  // it('/POST create 3 posts', async () => {
  //   const savedBlogs = [blog1, blog2];
  //   for (let i = 0; i < savedBlogs.length; i++) {
  //     const res = await createBlogsRequest(app).send(blogs[i]);
  //     expect(res.status).toBe(201);
  //     expect(res.body).toEqual(getCreatedBlogItem(blogs[i]));
  //     savedBlogs[i] = res.body;
  //   }
  //   [blog1, blog2] = savedBlogs;
  //
  //   const response1 = await getBlogsRequest(app);
  //   expect(response1.body.items).toHaveLength(2);
  //
  //   const savedPosts = [post1, post2, post3];
  //   for (let i = 0; i < savedPosts.length; i++) {
  //     const currentBlog = i < 2 ? blog1 : blog2;
  //     const res = await createPostRequest(app).send({
  //       ...posts[i],
  //       blogId: currentBlog.id,
  //     });
  //     expect(res.status).toBe(201);
  //     expect(res.body).toEqual(getCreatedPostItem(posts[i], currentBlog));
  //     savedPosts[i] = res.body;
  //   }
  //   [post1, post2, post3] = savedPosts;
  //
  //   const response = await getPostsRequest(app);
  //   expect(response.body.items).toHaveLength(3);
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
