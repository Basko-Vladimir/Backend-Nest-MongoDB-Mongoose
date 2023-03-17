import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from './users/schemas/user.schema';
import { Blog, blogSchema } from './blogs/schemas/blog.schema';
import { Post, postSchema } from './posts/schemas/post.schema';
import { Like, likeSchema } from './likes/schemas/like.schema';
import { Comment, commentSchema } from './comments/schemas/comment.schema';
import {
  DeviceSession,
  deviceSessionSchema,
} from './devices-sessions/schemas/device-session.schema';
import {
  ClientRequest,
  clientRequestSchema,
} from './clients-requests/schemas/client-request.schema';

describe('AppController', () => {
  let appController: AppController;
  jest.setTimeout(20000);

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mongoUri),
        MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
        MongooseModule.forFeature([{ name: Blog.name, schema: blogSchema }]),
        MongooseModule.forFeature([{ name: Post.name, schema: postSchema }]),
        MongooseModule.forFeature([{ name: Like.name, schema: likeSchema }]),
        MongooseModule.forFeature([
          { name: Comment.name, schema: commentSchema },
        ]),
        MongooseModule.forFeature([
          { name: DeviceSession.name, schema: deviceSessionSchema },
        ]),
        MongooseModule.forFeature([
          { name: ClientRequest.name, schema: clientRequestSchema },
        ]),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
