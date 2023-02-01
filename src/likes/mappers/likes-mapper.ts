import { LikeDocument } from '../schemas/like.schema';
import { LikeInfoOutputModel } from '../dto/likes-output-models.dto';

export const mapDbLikeToLikeInfoOutputModel = (
  like: LikeDocument,
): LikeInfoOutputModel => {
  return {
    userId: String(like.userId),
    login: like.userLogin,
    addedAt: like.createdAt.toISOString(),
  };
};
