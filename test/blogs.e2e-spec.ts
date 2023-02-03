import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import {
  blogs,
  defaultGetAllResponse,
  getAllItemsWithPage2Size1,
  getCreatedPostItem,
  INVALID_ID,
  notFoundException,
  posts,
  updatedBlogData,
} from './mockData';
import {
  AllBlogsOutputModel,
  BlogAllFullPostsOutputModel,
  IBlogOutputModel,
} from '../src/blogs/dto/blogs-output-models.dto';

describe('Blogs', () => {
  let app;
  let blog1, blog2, blog3;
  let post1;

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

  const createPostByBlogId = (blogId: string) => {
    return request(app.getHttpServer()).post(`/blogs/${blogId}/posts`);
  };
  const getPostsByBlogId = (blogId: string) => {
    return request(app.getHttpServer()).get(`/blogs/${blogId}/posts`);
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
    expect(response.body).toEqual(defaultGetAllResponse);
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

  it('/GET ALL blogs with query Params', async () => {
    const response1 = await getBlogsRequest().query({
      pageNumber: 2,
      pageSize: 1,
    });
    const expectedResult = getAllItemsWithPage2Size1<
      IBlogOutputModel,
      AllBlogsOutputModel
    >(blog2);
    expect(response1.body).toEqual(expectedResult);

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

  it('CREATE POST create post for blog by invalid blogId', async () => {
    const response = await createPostByBlogId(INVALID_ID).send(posts[0]);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('CREATE POST create post for blog by valid blogId', async () => {
    const response = await createPostByBlogId(blog1.id).send(posts[0]);
    const targetPost = getCreatedPostItem(posts[0], blog1);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(targetPost);
    post1 = response.body;
  });

  it('GET POSTS gets posts by invalid blogId', async () => {
    const response = await getPostsByBlogId(INVALID_ID);
    expect(response.status).toBe(404);
    expect(response.body).toEqual(notFoundException);
  });

  it('GET POSTS gets posts by valid blogId', async () => {
    const response = await getPostsByBlogId(blog1.id);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      page: 1,
      pageSize: 10,
      pagesCount: 1,
      totalCount: 1,
      items: [post1],
    } as BlogAllFullPostsOutputModel);
  });

  afterAll(async () => {
    await app.close();
  });
});
