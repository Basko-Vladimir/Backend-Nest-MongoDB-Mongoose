import {
  auth,
  blogs,
  comments,
  errors,
  INVALID_ID,
  posts,
  users,
  likes,
} from './mockData';
import { INestApplication } from '@nestjs/common';
import {
  createBlogsRequest,
  createCommentByPostIdRequest,
  createPostRequest,
  createUserRequest,
  deleteCommentRequest,
  getCommentRequest,
  initTestApp,
  loginRequest,
  updateCommentLikeStatus,
  updateCommentRequest,
  updatePostLikeStatus,
} from './utils';
import { LikeStatus } from '../src/common/enums';
import { IFullCommentOutputModel } from '../src/comments/dto/comments-output-models.dto';

describe('Comments', () => {
  const { correctCreateBlogDtos } = blogs;
  const { notFoundException } = errors;
  const { correctCreatePostDtos, correctUpdatePostDto } = posts;
  const { correctBasicCredentials, incorrectAccessToken } = auth;
  const {
    correctCreateCommentDtos,
    commentsBadQueryResponse,
    incorrectCommentsDtos,
    correctUpdateCommentDto,
    getCommentItem,
  } = comments;
  const {
    correctUpdateLikeStatusDto,
    incorrectLikeStatusDto,
    likeBadQueryResponse,
  } = likes;
  const { correctCreateUserDtos } = users;
  let app: INestApplication;
  let post1;
  let comment1;
  let blog1;
  let user1Token;

  beforeAll(async () => {
    app = await initTestApp();
  });

  describe('Preparing data', () => {
    it('User creating', async () => {
      const response1 = await createUserRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateUserDtos[0]);
      expect(response1.status).toBe(201);
    });

    it('User login', async () => {
      const response = await loginRequest(app).send({
        loginOrEmail: correctCreateUserDtos[0].login,
        password: correctCreateUserDtos[0].password,
      });
      expect(response.status).toBe(200);
      user1Token = `Bearer ${response.body.accessToken}`;
    });

    it('Blog creating', async () => {
      const response = await createBlogsRequest(app)
        .set(correctBasicCredentials)
        .send(correctCreateBlogDtos[0]);
      expect(response.status).toBe(201);
      blog1 = response.body;
    });

    it('Post creating', async () => {
      const response = await createPostRequest(app)
        .set(correctBasicCredentials)
        .send({ ...correctCreatePostDtos[0], blogId: blog1.id });
      expect(response.status).toBe(201);
      post1 = response.body;
    });

    it('Comment creating', async () => {
      const response = await createCommentByPostIdRequest(app, post1.id)
        .set({ Authorization: user1Token })
        .send(correctCreateCommentDtos[0]);
      expect(response.status).toBe(201);
      comment1 = response.body;
    });
  });

  describe('/(GET ONE COMMENT) get one comment', () => {
    it('by invalid id', async () => {
      const response3 = await getCommentRequest(app, INVALID_ID);
      expect(response3.status).toBe(404);
    });

    it('by valid id', async () => {
      const response3 = await getCommentRequest(app, comment1.id);
      expect(response3.status).toBe(200);
      expect(response3.body).toEqual(
        getCommentItem(comment1.content, correctCreateUserDtos[0].login),
      );
    });
  });

  describe('/(UPDATE ONE COMMENT)', () => {
    it('incorrect token or without it', async () => {
      const response1 = await updateCommentRequest(app, post1.id).send(
        correctUpdatePostDto,
      );
      expect(response1.status).toBe(401);

      const response2 = await updateCommentRequest(app, post1.id)
        .set({ Authorization: incorrectAccessToken })
        .send(correctUpdateCommentDto);
      expect(response2.status).toBe(401);
    });

    it('correct token but invalid id', async () => {
      const response = await updateCommentRequest(app, INVALID_ID)
        .set({ Authorization: user1Token })
        .send(correctUpdateCommentDto);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct token, valid id but incorrect input data', async () => {
      for (let i = 0; i < incorrectCommentsDtos.length; i++) {
        const response = await updateCommentRequest(app, comment1.id)
          .set({ Authorization: user1Token })
          .send(incorrectCommentsDtos[i]);
        expect(response.status).toBe(400);
        expect(response.body).toEqual(commentsBadQueryResponse);
      }
    });

    it('correct all (token, id, input data)', async () => {
      const response1 = await updateCommentRequest(app, comment1.id)
        .set({ Authorization: user1Token })
        .send(correctCreateCommentDtos[0]);
      expect(response1.status).toBe(204);

      const response2 = await getCommentRequest(app, comment1.id);
      expect(response2.body).toEqual(
        getCommentItem(comment1.content, correctCreateUserDtos[0].login),
      );
    });
  });

  describe('/(UPDATE COMMENT LIKE STATUS)', () => {
    it('incorrect token or without it', async () => {
      const response1 = await updateCommentLikeStatus(app, comment1.id).send(
        correctUpdateLikeStatusDto[0],
      );
      expect(response1.status).toBe(401);

      const response2 = await updatePostLikeStatus(app, comment1.id)
        .set({ Authorization: incorrectAccessToken })
        .send(correctUpdateLikeStatusDto[0]);
      expect(response2.status).toBe(401);
    });

    it('correct token but invalid id', async () => {
      const response = await updateCommentLikeStatus(app, INVALID_ID)
        .set({ Authorization: user1Token })
        .send(correctUpdateLikeStatusDto[0]);
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct token, valid id but incorrect input data', async () => {
      for (let i = 0; i < incorrectLikeStatusDto.length; i++) {
        const response = await updateCommentLikeStatus(app, comment1.id)
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

        const response1 = await updateCommentLikeStatus(app, comment1.id)
          .set({ Authorization: user1Token })
          .send(correctUpdateLikeStatusDto[i]);
        expect(response1.status).toBe(204);

        const response2 = await getCommentRequest(app, comment1.id).set({
          Authorization: user1Token,
        });
        expect(response2.status).toBe(200);
        expect(response2.body).toEqual({
          ...comment1,
          likesInfo: {
            likesCount: isLike ? 1 : 0,
            dislikesCount: isDislike ? 1 : 0,
            myStatus: correctUpdateLikeStatusDto[i].likeStatus,
          },
        } as IFullCommentOutputModel);
      }
    });
  });

  describe('/(DELETE ONE COMMENT) delete one comment', () => {
    it('incorrect token or without it', async () => {
      const response1 = await deleteCommentRequest(app, comment1.id);
      expect(response1.status).toBe(401);

      const response2 = await deleteCommentRequest(app, comment1.id).set({
        Authorization: incorrectAccessToken,
      });
      expect(response2.status).toBe(401);
    });

    it('correct token but invalid id', async () => {
      const response = await deleteCommentRequest(app, INVALID_ID).set({
        Authorization: user1Token,
      });
      expect(response.status).toBe(404);
      expect(response.body).toEqual(notFoundException);
    });

    it('correct token and valid id', async () => {
      const response = await deleteCommentRequest(app, comment1.id).set({
        Authorization: user1Token,
      });
      expect(response.status).toBe(204);

      const response2 = await getCommentRequest(app, comment1.id);
      expect(response2.status).toBe(404);
      expect(response2.body).toEqual(notFoundException);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
