import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, LikeModelType } from '../schemas/like.schema';
import { UpdateOrFilterModel } from '../../common/types';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) protected LikeModel: LikeModelType) {}

  async getLikeByFilter(
    filter: UpdateOrFilterModel,
  ): Promise<LikeDocument | null> {
    return this.LikeModel.findOne(filter);
  }

  async saveLike(like: LikeDocument): Promise<LikeDocument> {
    return like.save();
  }
}
