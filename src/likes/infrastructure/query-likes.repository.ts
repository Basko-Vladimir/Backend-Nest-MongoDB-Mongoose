import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../schemas/like.schema';
import {
  ExtendedLikesInfoOutputModel,
  LikesInfoOutputModel,
} from '../dto/likes-output-models.dto';
import { LikeStatus } from '../../common/enums';
import { mapDbLikeToLikeInfoOutputModel } from '../mappers/likes-mapper';
import { UpdateOrFilterModel } from '../../common/types';

@Injectable()
export class QueryLikesRepository {
  constructor(@InjectModel(Like.name) protected LikeModel: LikeModelType) {}

  async getLikesInfo(
    userId: string | null,
    commentId: string,
    notBannedUsersFilter: UpdateOrFilterModel[],
  ): Promise<LikesInfoOutputModel> {
    const likesCount = await this.LikeModel.countDocuments({
      commentId,
      status: LikeStatus.LIKE,
      $or: notBannedUsersFilter,
    });
    const dislikesCount = await this.LikeModel.countDocuments({
      commentId,
      status: LikeStatus.DISLIKE,
      $or: notBannedUsersFilter,
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
    notBannedUsersFilter: UpdateOrFilterModel[],
  ): Promise<ExtendedLikesInfoOutputModel> {
    const likesCount = await this.LikeModel.countDocuments({
      postId,
      commentId: null,
      status: LikeStatus.LIKE,
      $or: notBannedUsersFilter,
    });
    const dislikesCount = await this.LikeModel.countDocuments({
      postId,
      commentId: null,
      status: LikeStatus.DISLIKE,
      $or: notBannedUsersFilter,
    });
    const newestLikes = await this.LikeModel.find({
      commentId: null,
      postId,
      status: LikeStatus.LIKE,
      $or: notBannedUsersFilter,
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
