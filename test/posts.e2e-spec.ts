import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import {
  blogs,
  defaultGetAllResponse,
  getAllItemsWithPage2Size1,
  getCreatedBlogItem,
  getCreatedPostItem,
  INVALID_ID,
  notFoundException,
  posts,
  updatedPostData,
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
  let app: INestApplication;
  let post1, post2, post3;
  let blog1, blog2;

  beforeAll(async () => {
    app = await initTestApp();
  });

  it('/DELETE ALL clear all database', async () => {
    const response1 = await request(app.getHttpServer()).delete(
      '/testing/all-data',
    );
    expect(response1.status).toBe(204);
  });

  it('/GET ALL get all posts', async () => {
    const response = await getPostsRequest(app);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(defaultGetAllResponse);
  });

  it('/POST create 3 posts', async () => {
    const savedBlogs = [blog1, blog2];
    for (let i = 0; i < savedBlogs.length; i++) {
      const res = await createBlogsRequest(app).send(blogs[i]);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(getCreatedBlogItem(blogs[i]));
      savedBlogs[i] = res.body;
    }
    [blog1, blog2] = savedBlogs;

    const response1 = await getBlogsRequest(app);
    expect(response1.body.items).toHaveLength(2);

    const savedPosts = [post1, post2, post3];
    for (let i = 0; i < savedPosts.length; i++) {
      const currentBlog = i < 2 ? blog1 : blog2;
      const res = await createPostRequest(app).send({
        ...posts[i],
        blogId: currentBlog.id,
      });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(getCreatedPostItem(posts[i], currentBlog));
      savedPosts[i] = res.body;
    }
    [post1, post2, post3] = savedPosts;

    const response = await getPostsRequest(app);
    expect(response.body.items).toHaveLength(3);
  });

  it('/GET ALL posts with query Params', async () => {
    const response1 = await getPostsRequest(app).query({
      pageNumber: 2,
      pageSize: 1,
    });
    const expectedResult = getAllItemsWithPage2Size1<
      IPostOutputModel,
      AllPostsOutputModel
    >(post2);
    expect(response1.body).toEqual(expectedResult);

    const response3 = await getPostsRequest(app).query({
      sortBy: 'title',
      sortDirection: 'asc',
    });
    expect(response3.body.items[0].id).toBe(post1.id);
    expect(response3.body.items[response3.body.items.length - 1].id).toBe(
      post3.id,
    );
  });

  it('/GET ONE get one post by invalid id', async () => {
    const response = await getPostRequest(app, INVALID_ID);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('/GET ONE get one post by id', async () => {
    const response = await getPostRequest(app, post2.id);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(post2);
  });

  it('/UPDATE ONE update post by invalid id', async () => {
    const response = await updatePostRequest(app, INVALID_ID).send(
      updatedPostData,
    );
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('/UPDATE ONE update post by valid id', async () => {
    const response1 = await updatePostRequest(app, post2.id).send({
      ...updatedPostData,
      blogId: blog1.id,
    });
    expect(response1.status).toBe(204);

    const response2 = await getPostRequest(app, post2.id);
    expect(response2.body).toEqual({
      ...post2,
      ...updatedPostData,
    });
  });

  it('/DELETE ONE delete post by invalid id', async () => {
    const response = await deletePostRequest(app, INVALID_ID);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('/DELETE ONE delete post by valid id', async () => {
    const response = await deletePostRequest(app, post1.id);
    expect(response.status).toBe(204);

    const response2 = await deletePostRequest(app, post1.id);
    expect(response2.status).toBe(404);
    expect(response2.body).toEqual(notFoundException);
  });

  it('GET ALL get comments for post by invalid postId', async () => {
    const response = await getCommentsByPostIdRequest(app, INVALID_ID);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('GET All get comments for post by valid postId', async () => {
    const response = await getCommentsByPostIdRequest(app, post2.id);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(defaultGetAllResponse);
  });

  afterAll(async () => {
    await app.close();
  });
});
