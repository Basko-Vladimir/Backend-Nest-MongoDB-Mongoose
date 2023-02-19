import { auth, blogs, errors, defaultResponses, INVALID_ID } from './mockData';
import {
  AllBlogsOutputModel,
  BlogAllFullPostsOutputModel,
  IBlogOutputModel,
} from '../src/blogs/dto/blogs-output-models.dto';
import {
  initTestApp,
  createBlogsRequest,
  createPostByBlogIdRequest,
  deleteBlogRequest,
  getBlogRequest,
  getBlogsRequest,
  getPostsByBlogIdRequest,
  updateBlogRequest,
  clearDataBase,
} from './utils';
import { CreateBlogDto } from '../src/blogs/dto/create-blog.dto';

describe('Blogs', () => {
  const {
    incorrectBlogsDtos,
    correctCreateBlogsDtos,
    getCreatedBlogItem,
    blogsBadQueryResponse,
  } = blogs;
  const { notFoundException } = errors;
  const { incorrectBasicCredentials, correctBasicCredentials } = auth;
  const { defaultGetAllResponse, getAllItemsWithPage2Size1 } = defaultResponses;
  let app;
  let blog1, blog2, blog3;
  let post1;

  beforeAll(async () => {
    app = await initTestApp();
  });

  describe('/(POST) create blogs', () => {
    it('incorrect auth credentials or without them', async () => {
      const response1 = await createBlogsRequest(app).send(blogs[0]);
      expect(response1.status).toBe(401);

      const response2 = await createBlogsRequest(app)
        .set(incorrectBasicCredentials)
        .send(blogs[0]);
      expect(response2.status).toBe(401);
    });

    it('correct auth credentials and incorrect input data', async () => {
      for (let i = 0; i <= incorrectBlogsDtos.length; i++) {
        const response = await createBlogsRequest(app)
          .set(correctBasicCredentials)
          .send(incorrectBlogsDtos[i]);
        expect(response.status).toBe(400);
        expect(response.body).toEqual(blogsBadQueryResponse);
      }
    });

    it('correct auth credentials and correct input data', async () => {
      const response1 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogsDtos[0]);
      expect(response1.status).toBe(201);
      expect(response1.body).toEqual(
        getCreatedBlogItem(correctCreateBlogsDtos[0]),
      );
      blog1 = response1.body;

      const response2 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogsDtos[1]);
      expect(response2.status).toBe(201);
      expect(response2.body).toEqual(
        getCreatedBlogItem(correctCreateBlogsDtos[1]),
      );
      blog2 = response2.body;

      const response3 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogsDtos[2]);
      expect(response3.status).toBe(201);
      expect(response3.body).toEqual(
        getCreatedBlogItem(correctCreateBlogsDtos[2]),
      );
      blog3 = response3.body;

      const response4 = await getBlogsRequest(app);
      expect(response4.body.items).toHaveLength(3);
    });
  });

  describe('/(GET ALL) get all blogs', () => {
    it('with query Params', async () => {
      const response1 = await getBlogsRequest(app).query({
        pageNumber: 2,
        pageSize: 1,
      });
      const expectedResult = getAllItemsWithPage2Size1<
        IBlogOutputModel,
        AllBlogsOutputModel
      >(blog2);
      expect(response1.body).toEqual(expectedResult);

      const response2 = await getBlogsRequest(app).query({
        searchNameTerm: '2',
      });
      expect(response2.body.items).toHaveLength(1);
      expect(response2.body.totalCount).toBe(1);
      expect(response2.body.items[0].id).toBe(blog2.id);

      const response3 = await getBlogsRequest(app).query({
        sortBy: 'name',
        sortDirection: 'asc',
      });
      expect(response3.body.items[0].id).toBe(blog1.id);
      expect(response3.body.items[response3.body.items.length - 1].id).toBe(
        blog3.id,
      );
    });

    it('by default without created blogs', async () => {
      await clearDataBase(app);

      const response = await getBlogsRequest(app);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(defaultGetAllResponse);
    });
  });

  describe('(/GET ONE) get one blog', () => {
    it('by invalid id', async () => {
      const response = await getBlogRequest(app, INVALID_ID);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('by valid id', async () => {
      const response1 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogsDtos[0]);
      expect(response1.status).toBe(201);
      blog1 = response1.body;

      const response = await getBlogRequest(app, blog1.id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(blog1);
    });
  });

  // describe('(UPDATE ONE) update blog', () => {
  //   it('/UPDATE ONE update blog by invalid id', async () => {
  //     const response = await updateBlogRequest(app, INVALID_ID).send(
  //       updatedBlogData,
  //     );
  //     expect(response.status).toBe(404);
  //     expect(response.body).toEqual(notFoundException);
  //   });
  // });

  //
  // it('/UPDATE ONE update blog by valid id', async () => {
  //   const response = await updateBlogRequest(app, blog2.id).send(
  //     updatedBlogData,
  //   );
  //   expect(response.status).toBe(204);
  //
  //   const response2 = await getBlogRequest(app, blog2.id);
  //   expect(response2.body).toEqual({
  //     id: expect.any(String),
  //     createdAt: expect.any(String),
  //     name: updatedBlogData.name,
  //     description: updatedBlogData.description,
  //     websiteUrl: updatedBlogData.websiteUrl,
  //   });
  // });
  //
  // it('/DELETE ONE delete blog by invalid id', async () => {
  //   const response = await deleteBlogRequest(app, INVALID_ID);
  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual(notFoundException);
  // });
  //
  // it('/DELETE ONE delete blog by valid id', async () => {
  //   const response = await deleteBlogRequest(app, blog3.id);
  //   expect(response.status).toBe(204);
  //
  //   const response2 = await getBlogRequest(app, blog3.id);
  //   expect(response2.status).toBe(404);
  //   expect(response2.body).toEqual(notFoundException);
  //
  //   const response3 = await getBlogsRequest(app);
  //   expect(response3.body.items).toHaveLength(2);
  //   expect(response3.body.items).not.toContainEqual(blog3);
  // });
  //
  // it('CREATE POST create post for blog by invalid blogId', async () => {
  //   const response = await createPostByBlogIdRequest(app, INVALID_ID).send(
  //     posts[0],
  //   );
  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual(notFoundException);
  // });
  //
  // it('CREATE POST create post for blog by valid blogId', async () => {
  //   const response = await createPostByBlogIdRequest(app, blog1.id).send(
  //     posts[0],
  //   );
  //   const targetPost = getCreatedPostItem(posts[0], blog1);
  //   expect(response.status).toBe(201);
  //   expect(response.body).toEqual(targetPost);
  //   post1 = response.body;
  // });
  //
  // it('GET POSTS gets posts by invalid blogId', async () => {
  //   const response = await getPostsByBlogIdRequest(app, INVALID_ID);
  //   expect(response.status).toBe(404);
  //   expect(response.body).toEqual(notFoundException);
  // });
  //
  // it('GET POSTS gets posts by valid blogId', async () => {
  //   const response = await getPostsByBlogIdRequest(app, blog1.id);
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual({
  //     page: 1,
  //     pageSize: 10,
  //     pagesCount: 1,
  //     totalCount: 1,
  //     items: [post1],
  //   } as BlogAllFullPostsOutputModel);
  // });

  afterAll(async () => {
    await app.close();
  });
});
