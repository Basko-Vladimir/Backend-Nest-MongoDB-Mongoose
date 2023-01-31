import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateOrFilterModel } from '../common/types';
import { Like, LikeDocument, LikeModelType } from './schemas/like.schema';
import {
  ExtendedLikesInfoOutputModel,
  LikesInfoOutputModel,
} from './dto/likes-output-models.dto';
import { LikeStatus } from '../common/enums';
import { mapDbLikeToLikeInfoOutputModel } from './mappers/likes-mapper';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) protected LikeModel: LikeModelType) {}

  async getLikeByFilter(filter: UpdateOrFilterModel): Promise<LikeDocument> {
    const targetLike = await this.LikeModel.findOne(filter);

    if (!targetLike) throw new NotFoundException();

    return targetLike;
  }

  async getLikesInfo(
    userId: string | null,
    commentId: string,
  ): Promise<LikesInfoOutputModel> {
    const likesCount = await this.LikeModel.countDocuments({
      commentId,
      status: LikeStatus.LIKE,
    });
    const dislikesCount = await this.LikeModel.countDocuments({
      commentId,
      status: LikeStatus.DISLIKE,
    });
    let myStatus = LikeStatus.NONE;

    if (userId) {
      const like = await this.LikeModel.findOne({ userId, commentId });
      myStatus = like ? like.status : myStatus;
    }

    return {
      likesCount,
      dislikesCount,
      myStatus,
    };
  }

  async getExtendedLikesInfo(
    userId: string | null,
    postId: string,
  ): Promise<ExtendedLikesInfoOutputModel> {
    const likesCount = await this.LikeModel.countDocuments({
      postId,
      commentId: null,
      status: LikeStatus.LIKE,
    });
    const dislikesCount = await this.LikeModel.countDocuments({
      postId,
      commentId: null,
      status: LikeStatus.DISLIKE,
    });
    const newestLikes = await this.LikeModel.find({
      commentId: null,
      postId,
      status: LikeStatus.LIKE,
    })
      .sort('-updatedAt')
      .limit(3);
    let myStatus = LikeStatus.NONE;

    if (userId) {
      const like = await this.LikeModel.findOne({
        userId,
        commentId: null,
        postId,
      });
      myStatus = like ? like.status : myStatus;
    }

    return {
      likesCount,
      dislikesCount,
      myStatus,
      newestLikes: newestLikes.map(mapDbLikeToLikeInfoOutputModel),
    };
  }
}
