import {
  auth,
  blogs,
  posts,
  errors,
  defaultResponses,
  INVALID_ID,
} from './mockData';
import {
  AllBlogsOutputModel,
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
import {
  AllPostsOutputModel,
  IPostOutputModel,
} from '../src/posts/dto/posts-output-models.dto';

describe('Blogs', () => {
  // jest.setTimeout(60 * 1000);
  const {
    incorrectBlogsDtos,
    correctCreateBlogDtos,
    correctUpdateBlogDto,
    getCreatedBlogItem,
    blogsBadQueryResponse,
  } = blogs;
  const {
    correctCreatePostDtos,
    incorrectPostsDtos,
    postsBadQueryResponse,
    getPostItem,
  } = posts;
  const { notFoundException } = errors;
  const { incorrectBasicCredentials, correctBasicCredentials } = auth;
  const { defaultGetAllResponse, getAllItemsWithPage2Size1 } = defaultResponses;
  let app;
  let blog1, blog2, blog3;
  let post1, post2;

  beforeAll(async () => {
    app = await initTestApp();
  });

  describe('/(POST BLOGS) create blog', () => {
    it('incorrect auth credentials or without them', async () => {
      const response1 = await createBlogsRequest(app).send(
        correctCreateBlogDtos[0],
      );
      expect(response1.status).toBe(401);

      const response2 = await createBlogsRequest(app)
        .set(incorrectBasicCredentials)
        .send(correctCreateBlogDtos[0]);
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
        .send(correctCreateBlogDtos[0]);
      expect(response1.status).toBe(201);
      expect(response1.body).toEqual(
        getCreatedBlogItem(correctCreateBlogDtos[0]),
      );
      blog1 = response1.body;

      const response2 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogDtos[1]);
      expect(response2.status).toBe(201);
      expect(response2.body).toEqual(
        getCreatedBlogItem(correctCreateBlogDtos[1]),
      );
      blog2 = response2.body;

      const response3 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogDtos[2]);
      expect(response3.status).toBe(201);
      expect(response3.body).toEqual(
        getCreatedBlogItem(correctCreateBlogDtos[2]),
      );
      blog3 = response3.body;

      const response4 = await getBlogsRequest(app);
      expect(response4.body.items).toHaveLength(3);
    });
  });

  describe('/(GET ALL BLOGS) get all blogs', () => {
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

  describe('/(GET ONE BLOG) get one blog', () => {
    it('by invalid id', async () => {
      const response = await getBlogRequest(app, INVALID_ID);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('by valid id', async () => {
      const response1 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogDtos[0]);
      expect(response1.status).toBe(201);
      blog1 = response1.body;

      const response = await getBlogRequest(app, blog1.id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(blog1);
    });
  });

  describe('/(UPDATE ONE BLOG) update blog', () => {
    it('incorrect auth credentials or without them', async () => {
      const response1 = await updateBlogRequest(app, blog1.id).send(
        correctUpdateBlogDto,
      );
      expect(response1.status).toBe(401);

      const response2 = await updateBlogRequest(app, blog1.id)
        .set(incorrectBasicCredentials)
        .send(correctUpdateBlogDto);
      expect(response2.status).toBe(401);
    });

    it('correct auth credentials but invalid id', async () => {
      const response = await updateBlogRequest(app, INVALID_ID)
        .set(correctBasicCredentials)
        .send(correctUpdateBlogDto);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct auth credentials, valid id but incorrect input data', async () => {
      for (let i = 0; i <= incorrectBlogsDtos.length; i++) {
        const response = await updateBlogRequest(app, blog1.id)
          .set(correctBasicCredentials)
          .send(incorrectBlogsDtos[i]);
        expect(response.status).toBe(400);
        expect(response.body).toEqual(blogsBadQueryResponse);
      }
    });

    it('correct all (auth credentials, id, input data)', async () => {
      const response = await updateBlogRequest(app, blog1.id)
        .set(correctBasicCredentials)
        .send(correctUpdateBlogDto);
      expect(response.status).toBe(204);

      const response2 = await getBlogRequest(app, blog1.id);
      expect(response2.body).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        isMembership: false,
        name: correctUpdateBlogDto.name,
        description: correctUpdateBlogDto.description,
        websiteUrl: correctUpdateBlogDto.websiteUrl,
      });
    });
  });

  describe('/(DELETE ONE BLOG) delete blog', () => {
    it('incorrect auth credentials or without them', async () => {
      const response1 = await deleteBlogRequest(app, blog1.id);
      expect(response1.status).toBe(401);

      const response2 = await deleteBlogRequest(app, blog1.id).set(
        incorrectBasicCredentials,
      );
      expect(response2.status).toBe(401);
    });

    it('correct auth credentials but invalid id', async () => {
      const response = await deleteBlogRequest(app, INVALID_ID).set(
        correctBasicCredentials,
      );
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct auth credentials and valid id', async () => {
      const response = await deleteBlogRequest(app, blog1.id).set(
        correctBasicCredentials,
      );
      expect(response.status).toBe(204);

      const response2 = await getBlogRequest(app, blog1.id);
      expect(response2.status).toBe(404);
      expect(response2.body).toEqual(notFoundException);
    });
  });

  describe('/(POST POSTS) create post', () => {
    beforeAll(async () => {
      const response1 = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogDtos[1]);
      expect(response1.status).toBe(201);
      blog1 = response1.body;
    });

    it('incorrect auth credentials or without them', async () => {
      const response2 = await createPostByBlogIdRequest(app, blog1.id).send(
        correctCreatePostDtos,
      );
      expect(response2.status).toBe(401);

      const response3 = await createPostByBlogIdRequest(app, blog1.id)
        .set(incorrectBasicCredentials)
        .send(correctCreatePostDtos);
      expect(response3.status).toBe(401);
    });

    it('correct auth credentials but incorrect blog id', async () => {
      const response = await createPostByBlogIdRequest(app, INVALID_ID)
        .set(correctBasicCredentials)
        .send(correctCreatePostDtos[0]);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct auth credentials, valid blog id but incorrect input data', async () => {
      for (let i = 0; i <= incorrectPostsDtos.length; i++) {
        const response = await createPostByBlogIdRequest(app, blog1.id)
          .set(correctBasicCredentials)
          .send(incorrectPostsDtos[i]);
        expect(response.status).toBe(400);
        expect(response.body).toEqual(postsBadQueryResponse);
      }
    });

    it('correct all (auth credentials, id, input data)', async () => {
      const response1 = await createPostByBlogIdRequest(app, blog1.id)
        .set(correctBasicCredentials)
        .send(correctCreatePostDtos[0]);
      const targetPost1 = getPostItem(correctCreatePostDtos[0], blog1);
      expect(response1.status).toBe(201);
      expect(response1.body).toEqual(targetPost1);
      post1 = response1.body;

      const response2 = await createPostByBlogIdRequest(app, blog1.id)
        .set(correctBasicCredentials)
        .send(correctCreatePostDtos[1]);
      const targetPost2 = getPostItem(correctCreatePostDtos[1], blog1);
      expect(response2.status).toBe(201);
      expect(response2.body).toEqual(targetPost2);
      post2 = response2.body;
    });
  });

  describe('/(GET ALL POSTS) get all posts', () => {
    it('by invalid blogId', async () => {
      const response = await getPostsByBlogIdRequest(app, INVALID_ID);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('by valid blogId without query params', async () => {
      const response = await getPostsByBlogIdRequest(app, blog1.id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        page: 1,
        pageSize: 10,
        pagesCount: 1,
        totalCount: 2,
        items: [post2, post1],
      });
    });

    it('by valid blogId with query params', async () => {
      const response1 = await getPostsByBlogIdRequest(app, blog1.id).query({
        pageNumber: 2,
        pageSize: 1,
      });
      const expectedResult = getAllItemsWithPage2Size1<
        IPostOutputModel,
        AllPostsOutputModel
      >(post1);
      expect(response1.body).toEqual({
        ...expectedResult,
        pagesCount: 2,
        totalCount: 2,
      });

      const response2 = await getPostsByBlogIdRequest(app, blog1.id).query({
        sortBy: 'title',
        sortDirection: 'asc',
      });
      expect(response2.body.items[0].id).toBe(post1.id);
      expect(response2.body.items[response2.body.items.length - 1].id).toBe(
        post2.id,
      );
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
