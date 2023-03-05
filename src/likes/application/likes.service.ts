import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../infrastructure/likes.repository';
import { UpdateOrFilterModel } from '../../common/types';
import { Like, LikeDocument, LikeModelType } from '../schemas/like.schema';
import {
  ExtendedLikesInfoOutputModel,
  LikesInfoOutputModel,
} from '../dto/likes-output-models.dto';
import { UserDocument } from '../../users/schemas/user.schema';
import { LikeStatus } from '../../common/enums';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LikesService {
  constructor(
    protected likesRepository: LikesRepository,
    @InjectModel(Like.name) protected LikeModel: LikeModelType,
  ) {}

  async getLikeByFilter(filter: UpdateOrFilterModel): Promise<LikeDocument> {
    return this.likesRepository.getLikeByFilter(filter);
  }

  async getLikesInfo(
    userId: string | null,
    commentId: string,
  ): Promise<LikesInfoOutputModel> {
    return this.likesRepository.getLikesInfo(userId, commentId);
  }

  async getExtendedLikesInfo(
    userId: string | null,
    postId: string,
  ): Promise<ExtendedLikesInfoOutputModel> {
    return this.likesRepository.getExtendedLikesInfo(userId, postId);
  }

  async createLike(
    user: UserDocument,
    postId: string,
    status: LikeStatus = LikeStatus.NONE,
    commentId?: string,
  ): Promise<void> {
    const createdLike = this.LikeModel.createLikeEntity(
      String(user._id),
      user.login,
      postId,
      status,
      this.LikeModel,
      commentId,
    );

    await this.likesRepository.saveLike(createdLike);
  }

  async updateLike(like: LikeDocument, status: LikeStatus): Promise<void> {
    const updatedLike = like.updateLikeStatus(status, like);
    await this.likesRepository.saveLike(updatedLike);
  }
}
