import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { exceptionFactory } from '../src/common/factories/exception.factory';
import { ServerErrorsFilter } from '../src/common/filters/server-errors.filter';
import { HttpExceptionsFilter } from '../src/common/filters/http-exceptions.filter';
import { useContainer } from 'class-validator';

export const initTestApp = async (): Promise<INestApplication> => {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app: INestApplication = moduleRef.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      stopAtFirstError: true,
      exceptionFactory,
    }),
  );
  app.useGlobalFilters(new ServerErrorsFilter(), new HttpExceptionsFilter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.init();
  app.use(cookieParser());
  await clearDataBase(app);

  return app;
};

//Clear all Data Base
export const clearDataBase = (app: INestApplication) =>
  request(app.getHttpServer()).delete('/testing/all-data');

//UserRequests
export const getUsersRequest = (app: INestApplication) =>
  request(app.getHttpServer()).get('/users');
export const createUserRequest = (app: INestApplication) =>
  request(app.getHttpServer()).post('/users');
export const deleteUserRequest = (app: INestApplication, userId: string) =>
  request(app.getHttpServer()).delete(`/users/${userId}`);

//Blogs requests
export const getBlogsRequest = (app: INestApplication) =>
  request(app.getHttpServer()).get('/blogs');
export const getBlogRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).get(`/blogs/${id}`);
export const createBlogsRequest = (app: INestApplication) =>
  request(app.getHttpServer()).post('/blogs');
export const deleteBlogRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).delete(`/blogs/${id}`);
export const updateBlogRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).put(`/blogs/${id}`);
export const createPostByBlogIdRequest = (
  app: INestApplication,
  blogId: string,
) => {
  return request(app.getHttpServer()).post(`/blogs/${blogId}/posts`);
};
export const getPostsByBlogIdRequest = (
  app: INestApplication,
  blogId: string,
) => {
  return request(app.getHttpServer()).get(`/blogs/${blogId}/posts`);
};

//Posts requests
export const getPostsRequest = (app: INestApplication) =>
  request(app.getHttpServer()).get('/posts');
export const getPostRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).get(`/posts/${id}`);
export const createPostRequest = (app: INestApplication) =>
  request(app.getHttpServer()).post('/posts');
export const deletePostRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).delete(`/posts/${id}`);
export const updatePostRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).put(`/posts/${id}`);
export const createCommentByPostIdRequest = (
  app: INestApplication,
  id: string,
) => request(app.getHttpServer()).post(`/posts/${id}/comments`);
export const getCommentsByPostIdRequest = (
  app: INestApplication,
  postId: string,
) => request(app.getHttpServer()).get(`/posts/${postId}/comments`);
export const updatePostLikeStatus = (app: INestApplication, postId: string) =>
  request(app.getHttpServer()).put(`/posts/${postId}/like-status`);

//Comments
export const getCommentRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).get(`/comments/${id}`);
export const deleteCommentRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).delete(`/comments/${id}`);
export const updateCommentRequest = (app: INestApplication, id: string) =>
  request(app.getHttpServer()).put(`/comments/${id}`);
export const updateCommentLikeStatus = (
  app: INestApplication,
  commentId: string,
) => request(app.getHttpServer()).put(`/comments/${commentId}/like-status`);

//Auth requests
export const registrationRequest = (app: INestApplication) =>
  request(app.getHttpServer()).post('/auth/registration');
export const registrationConfirmationRequest = (app: INestApplication) =>
  request(app.getHttpServer()).post('/auth/registration-confirmation');
export const loginRequest = (app: INestApplication) =>
  request(app.getHttpServer()).post('/auth/login');
