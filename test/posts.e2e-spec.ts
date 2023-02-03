import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  blogs,
  defaultGetAllResponse,
  getCreatedBlogItem,
  getCreatedPostItem,
  posts,
} from './mockData';
import {
  createBlogsRequest,
  createPostRequest,
  getBlogsRequest,
  getPostsRequest,
} from './utils';
import { IBlogOutputModel } from '../src/blogs/dto/blogs-output-models.dto';
import { CreatePostDto } from '../src/posts/dto/create-post.dto';

describe('Posts', () => {
  let app: INestApplication;
  let post1, post2, post3;
  let blog1, blog2;
  let comment1;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('/DELETE ALL clear all database', async () => {
    const response1 = await request(app.getHttpServer()).delete(
      '/testing/all-data',
    );
    expect(response1.status).toBe(204);
  });

  //   it('/GET ALL get all posts', async () => {
  //     const response = await getPostsRequest(app);
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual(defaultGetAllResponse);
  //   });
  //
  //   it('/POST create 3 posts', async () => {
  //     const savedBlogs = [blog1, blog2];
  //     for (let i = 0; i < savedBlogs.length; i++) {
  //       const res = await createBlogsRequest(app).send(blogs[i]);
  //       expect(res.status).toBe(201);
  //       expect(res.body).toEqual(getCreatedBlogItem(blogs[i]));
  //       savedBlogs[i] = res.body;
  //     }
  //
  //     const response1 = await getBlogsRequest(app);
  //     expect(response1.body.items).toHaveLength(2);
  //
  //     const savedPosts = [post1, post2, post3];
  //     for (let i = 0; i < savedPosts.length; i++) {
  //       const currentBlog = i < 2 ? blog1 : blog2;
  //       const res = await createPostRequest(app).send({
  //         ...posts[i],
  //         blogId: currentBlog.id,
  //       });
  //       expect(res.status).toBe(201);
  //       expect(res.body).toEqual(getCreatedPostItem(posts[i], currentBlog));
  //       savedPosts[i] = res.body;
  //     }
  //
  //     const response = await getPostsRequest(app);
  //     expect(response.body.items).toHaveLength(3);
  //   });
});
