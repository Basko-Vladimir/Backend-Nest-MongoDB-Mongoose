import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikesService } from './likes.service';
import { LikesRepository } from './likes.repository';
import { Like, likeSchema } from './schemas/like.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: likeSchema }]),
  ],
  providers: [LikesService, LikesRepository],
})
export class LikesModule {}
