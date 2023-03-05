import { Injectable } from '@nestjs/common';
import { LikesService } from '../../likes/application/likes.service';
import { UserDocument } from '../../users/schemas/user.schema';
import { LikeStatus } from '../../common/enums';

@Injectable()
export class PostsService {
  constructor(private likesService: LikesService) {}

  async updatePostLikeStatus(
    user: UserDocument,
    postId: string,
    newStatus: LikeStatus,
  ): Promise<void> {
    const existingLike = await this.likesService.getLikeByFilter({
      userId: String(user._id),
      postId,
      commentId: null,
    });

    if (existingLike) {
      return this.likesService.updateLike(existingLike, newStatus);
    } else {
      await this.likesService.createLike(user, postId, newStatus);
    }
  }
}
