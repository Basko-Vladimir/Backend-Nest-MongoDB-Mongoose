import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import {
  blogs,
  INVALID_ID,
  notFoundException,
  updatedBlogData,
} from './mockData';

describe('Blogs', () => {
  let app;
  let blog1, blog2, blog3;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  const getBlogsRequest = () => request(app.getHttpServer()).get('/blogs');
  const createBlogsRequest = () => request(app.getHttpServer()).post('/blogs');
  const getBlogRequest = (id: string) => {
    return request(app.getHttpServer()).get(`/blogs/${id}`);
  };
  const updateBlogRequest = (id: string) => {
    return request(app.getHttpServer()).put(`/blogs/${id}`);
  };
  const deleteBlogRequest = (id: string) => {
    return request(app.getHttpServer()).delete(`/blogs/${id}`);
  };

  it('/DELETE ALL clear all database', async () => {
    const response1 = await request(app.getHttpServer()).delete(
      '/testing/all-data',
    );
    expect(response1.status).toBe(204);

    const response2 = await getBlogsRequest();
    expect(response2.status).toBe(200);
    expect(response2.body.items).toHaveLength(0);
  });

  it('/GET ALL get all blogs', async () => {
    const response = await getBlogsRequest();

    expect(response.status).toBe(200);
    expect(response.body.pagesCount).toBe(0);
    expect(response.body.page).toBe(1);
    expect(response.body.pageSize).toBe(10);
    expect(response.body.totalCount).toBe(0);
    expect(response.body.items).toHaveLength(0);
  });

  it('/POST create 3 blogs', async () => {
    const response1 = await createBlogsRequest().send(blogs[0]);
    expect(response1.status).toBe(201);
    blog1 = response1.body;

    const response2 = await createBlogsRequest().send(blogs[1]);
    expect(response2.status).toBe(201);
    blog2 = response2.body;

    const response3 = await createBlogsRequest().send(blogs[2]);
    expect(response3.status).toBe(201);
    blog3 = response3.body;

    const response4 = await getBlogsRequest();
    expect(response4.body.items).toHaveLength(3);
  });

  it('/GET ALL users with query Params', async () => {
    const response1 = await getBlogsRequest().query({
      pageNumber: 2,
      pageSize: 1,
    });
    expect(response1.body.items).toHaveLength(1);
    expect(response1.body.totalCount).toBe(3);
    expect(response1.body.pagesCount).toBe(3);
    expect(response1.body.page).toBe(2);
    expect(response1.body.pageSize).toBe(1);
    expect(response1.body.items[0].id).toBe(blog2.id);

    const response2 = await getBlogsRequest().query({
      searchNameTerm: '2',
    });
    expect(response2.body.items).toHaveLength(1);
    expect(response2.body.totalCount).toBe(1);
    expect(response2.body.items[0].id).toBe(blog2.id);

    const response3 = await getBlogsRequest().query({
      sortBy: 'name',
      sortDirection: 'asc',
    });
    expect(response3.body.items[0].id).toBe(blog1.id);
    expect(response3.body.items[response3.body.items.length - 1].id).toBe(
      blog3.id,
    );
  });

  it('/GET ONE get one blog by invalid id', async () => {
    const response = await getBlogRequest(INVALID_ID);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('/GET ONE get one blog by id', async () => {
    const response = await getBlogRequest(blog2.id);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(blog2.id);
    expect(response.body.name).toBe(blog2.name);
  });

  it('/UPDATE ONE update blog by invalid id', async () => {
    const response = await updateBlogRequest(INVALID_ID).send(updatedBlogData);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('/UPDATE ONE update blog by valid id', async () => {
    const response = await updateBlogRequest(blog2.id).send(updatedBlogData);
    expect(response.status).toBe(204);

    const response2 = await getBlogRequest(blog2.id);
    expect(response2.body).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      name: updatedBlogData.name,
      description: updatedBlogData.description,
      websiteUrl: updatedBlogData.websiteUrl,
    });
  });

  it('/DELETE ONE delete blog by invalid id', async () => {
    const response = await deleteBlogRequest(INVALID_ID);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('/DELETE ONE delete blog by valid id', async () => {
    const response = await deleteBlogRequest(blog3.id);
    expect(response.status).toBe(204);

    const response2 = await getBlogRequest(blog3.id);
    expect(response2.status).toBe(404);
    expect(response2.body).toEqual(notFoundException);

    const response3 = await getBlogsRequest();
    expect(response3.body.items).toHaveLength(2);
    expect(response3.body.items).not.toContainEqual(blog3);
  });

  afterAll(async () => {
    await app.close();
  });
});
