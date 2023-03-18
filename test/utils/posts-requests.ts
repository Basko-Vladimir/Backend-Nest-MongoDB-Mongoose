import { INestApplication } from '@nestjs/common';
import request from 'supertest';

export const publicPostsRequests = {
  getPostsRequest: (app: INestApplication) => {
    return request(app.getHttpServer()).get('/posts');
  },
  getPostRequest: (app: INestApplication, id: string) => {
    return request(app.getHttpServer()).get(`/posts/${id}`);
  },
  createPostRequest: (app: INestApplication) => {
    return request(app.getHttpServer()).post('/posts');
  },
  deletePostRequest: (app: INestApplication, id: string) => {
    return request(app.getHttpServer()).delete(`/posts/${id}`);
  },
  updatePostRequest: (app: INestApplication, id: string) => {
    return request(app.getHttpServer()).put(`/posts/${id}`);
  },
  createCommentByPostIdRequest: (app: INestApplication, id: string) => {
    return request(app.getHttpServer()).post(`/posts/${id}/comments`);
  },
  getCommentsByPostIdRequest: (app: INestApplication, postId: string) => {
    return request(app.getHttpServer()).get(`/posts/${postId}/comments`);
  },
  updatePostLikeStatus: (app: INestApplication, postId: string) => {
    return request(app.getHttpServer()).put(`/posts/${postId}/like-status`);
  },
};
