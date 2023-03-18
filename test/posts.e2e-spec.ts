import { INestApplication } from '@nestjs/common';
import {
  blogs,
  INVALID_ID,
  posts,
  auth,
  defaultResponses,
  errors,
  users,
  comments,
  likes,
} from './mockData';
import {
  initTestApp,
  createBlogsRequest,
  createPostRequest,
  deletePostRequest,
  getPostRequest,
  getPostsRequest,
  updatePostRequest,
  getPostsByBlogIdAsUserRequest,
  clearDataBase,
  deleteBlogRequest,
  loginRequest,
  createCommentByPostIdRequest,
  getCommentsByPostIdRequest,
  createUserRequest,
  updatePostLikeStatus,
} from './utils/utils';
import {
  AllPostsOutputModel,
  IFullPostOutputModel,
  IPostOutputModel,
} from '../src/posts/api/dto/posts-output-models.dto';
import {
  AllCommentsOutputModel,
  IFullCommentOutputModel,
} from '../src/comments/api/dto/comments-output-models.dto';
import { LikeStatus } from '../src/common/enums';

describe('Posts', () => {
  jest.setTimeout(60 * 1000);
  const { correctCreateBlogDtos, incorrectBlogsIds } = blogs;
  const { notFoundException, unauthorisedException } = errors;
  const {
    correctCreatePostDtos,
    incorrectPostsDtos,
    postsBadQueryResponse,
    getPostItem,
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
    getCommentItem,
  } = comments;
  const {
    correctUpdateLikeStatusDto,
    incorrectLikeStatusDto,
    likeBadQueryResponse,
  } = likes;
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
    postsBadQueryResponse.errorsMessages.push({
      message: expect.any(String),
      field: 'blogId',
    });
  });

  describe('/(CREATE POST)', () => {
    it('incorrect auth credentials or without them', async () => {
      const response1 = await createPostRequest(app).send(
        correctCreatePostDtos[0],
      );
      expect(response1.status).toBe(401);

      const response2 = await createPostRequest(app)
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
          getPostItem(correctCreatePostDtos[i], blog1),
        );
        savedPosts[i] = result.body;
      }
      [post1, post2, post3] = savedPosts;

      const response2 = await getPostsRequest(app);
      expect(response2.body.items).toHaveLength(3);
    });
  });

  describe('/(GET All POSTS)', () => {
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

      const response2 = await getPostsByBlogIdAsUserRequest(
        app,
        blog1.id,
      ).query({
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

  describe('/(GET ONE POST)', () => {
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

  describe('/(UPDATE ONE POST)', () => {
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

  describe('/(POST COMMENTS)', () => {
    beforeAll(async () => {
      const response1 = await createUserRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateUserDtos[0]);
      expect(response1.status).toBe(201);
      user1 = response1.body;

      const response2 = await loginRequest(app).send({
        loginOrEmail: correctCreateUserDtos[0].login,
        password: correctCreateUserDtos[0].password,
      });
      expect(response2.status).toBe(200);
      user1Token = `Bearer ${response2.body.accessToken}`;
    });

    it('without token or with incorrect token', async () => {
      const response1 = await createCommentByPostIdRequest(app, post1.id).send(
        correctCreateCommentDtos[0],
      );
      expect(response1.status).toBe(401);
      expect(response1.body).toEqual(unauthorisedException);

      const response2 = await createCommentByPostIdRequest(app, post1.id)
        .set({ Authorization: incorrectAccessToken })
        .send(correctCreateCommentDtos[0]);
      expect(response2.status).toBe(401);
      expect(response2.body).toEqual(unauthorisedException);
    });

    it('correct token but invalid id', async () => {
      const response = await createCommentByPostIdRequest(app, INVALID_ID)
        .set({ Authorization: user1Token })
        .send(correctCreateCommentDtos[0]);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct token, valid postId but incorrect input data', async () => {
      for (let i = 0; i <= incorrectCommentsDtos.length; i++) {
        const response = await createCommentByPostIdRequest(app, post1.id)
          .set({ Authorization: user1Token })
          .send(incorrectCommentsDtos[i]);
        expect(response.status).toBe(400);
        expect(response.body).toEqual(commentsBadQueryResponse);
      }
    });

    it('everything is correct (token, id, input data)', async () => {
      const response1 = await createCommentByPostIdRequest(app, post1.id)
        .set({ Authorization: user1Token })
        .send(correctCreateCommentDtos[0]);
      expect(response1.status).toBe(201);
      expect(response1.body).toEqual(
        getCommentItem(
          correctCreateCommentDtos[0].content,
          correctCreateUserDtos[0].login,
        ),
      );
      comment1 = response1.body;
    });
  });

  describe('/(GET All COMMENTS)', () => {
    beforeAll(async () => {
      const response1 = await createCommentByPostIdRequest(app, post1.id)
        .set({ Authorization: user1Token })
        .send(correctCreateCommentDtos[1]);
      expect(response1.status).toBe(201);
      comment2 = response1.body;
    });

    it('by invalid id', async () => {
      const response = await getCommentsByPostIdRequest(app, INVALID_ID);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('by valid postId without query params', async () => {
      const response = await getCommentsByPostIdRequest(app, post1.id);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        page: 1,
        pageSize: 10,
        pagesCount: 1,
        totalCount: 2,
        items: [comment2, comment1],
      });
    });

    it('by valid postId with query params', async () => {
      const response1 = await getCommentsByPostIdRequest(app, post1.id).query({
        pageNumber: 2,
        pageSize: 1,
      });
      const expectedResult = getAllItemsWithPage2Size1<
        IFullCommentOutputModel,
        AllCommentsOutputModel
      >(comment1);
      expect(response1.body).toEqual({
        ...expectedResult,
        pagesCount: 2,
        totalCount: 2,
      });

      const response2 = await getCommentsByPostIdRequest(app, post1.id).query({
        sortBy: 'content',
        sortDirection: 'asc',
      });
      expect(response2.body.items[0].id).toBe(comment1.id);
      expect(response2.body.items[response2.body.items.length - 1].id).toBe(
        comment2.id,
      );
    });
  });

  describe('/(UPDATE POST LIKE STATUS)', () => {
    it('incorrect token or without it', async () => {
      const response1 = await updatePostLikeStatus(app, post1.id).send(
        correctUpdateLikeStatusDto[0],
      );
      expect(response1.status).toBe(401);

      const response2 = await updatePostLikeStatus(app, post1.id)
        .set({ Authorization: incorrectAccessToken })
        .send(correctUpdateLikeStatusDto[0]);
      expect(response2.status).toBe(401);
    });

    it('correct token but invalid id', async () => {
      const response = await updatePostLikeStatus(app, INVALID_ID)
        .set({ Authorization: user1Token })
        .send(correctUpdateLikeStatusDto[0]);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct token, valid id but incorrect input data', async () => {
      for (let i = 0; i < incorrectLikeStatusDto.length; i++) {
        const response = await updatePostLikeStatus(app, post1.id)
          .set({ Authorization: user1Token })
          .send(incorrectLikeStatusDto[i]);
        expect(response.status).toBe(400);
        expect(response.body).toEqual(likeBadQueryResponse);
      }
    });

    it('correct all (token, id, input data)', async () => {
      for (let i = 0; i < correctUpdateLikeStatusDto.length; i++) {
        const isLike =
          correctUpdateLikeStatusDto[i].likeStatus === LikeStatus.LIKE;
        const isDislike =
          correctUpdateLikeStatusDto[i].likeStatus === LikeStatus.DISLIKE;

        const response1 = await updatePostLikeStatus(app, post1.id)
          .set({ Authorization: user1Token })
          .send(correctUpdateLikeStatusDto[i]);
        expect(response1.status).toBe(204);

        const response2 = await getPostRequest(app, post1.id).set({
          Authorization: user1Token,
        });
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual({
          ...post1,
          ...correctUpdatePostDto,
          extendedLikesInfo: {
            likesCount: isLike ? 1 : 0,
            dislikesCount: isDislike ? 1 : 0,
            myStatus: correctUpdateLikeStatusDto[i].likeStatus,
            newestLikes: isLike
              ? [
                  {
                    login: user1.login,
                    userId: user1.id,
                    addedAt: expect.any(String),
                  },
                ]
              : [],
          },
        } as IFullPostOutputModel);
      }
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

  afterAll(async () => {
    await app.close();
  });
});
