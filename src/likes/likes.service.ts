import { Injectable } from '@nestjs/common';
import { LikesRepository } from './likes.repository';
import { UpdateOrFilterModel } from '../common/types';
import { LikeDocument } from './schemas/like.schema';
import {
  ExtendedLikesInfoOutputModel,
  LikesInfoOutputModel,
} from './dto/likes-output-models.dto';

@Injectable()
export class LikesService {
  constructor(protected likesRepository: LikesRepository) {}

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
}
