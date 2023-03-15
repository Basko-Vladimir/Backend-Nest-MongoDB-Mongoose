import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { LikeStatus } from '../../common/enums';

@Schema({ timestamps: true })
export class Like {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  userLogin: string;

  @Prop({
    type: Types.ObjectId,
    default: null,
  })
  commentId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  postId: Types.ObjectId;

  @Prop({
    type: String,
    enum: [LikeStatus.LIKE, LikeStatus.DISLIKE, LikeStatus.NONE],
    required: true,
  })
  status: LikeStatus;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  static createLikeEntity(
    userId: string,
    userLogin: string,
    postId: string,
    status: LikeStatus,
    LikeModel: LikeModelType,
    commentId?: string,
  ): LikeDocument {
    return new LikeModel({ userId, userLogin, postId, status, commentId });
  }

  updateLikeStatus(status: LikeStatus): void {
    this.status = status;
  }
}

export type LikeDocument = HydratedDocument<Like>;

export interface ILikeStaticMethods {
  createLikeEntity(
    userId: string,
    userLogin: string,
    postId: string,
    status: LikeStatus,
    LikeModel: LikeModelType,
    commentId?: string,
  ): LikeDocument;
}

export type LikeModelType = Model<Like> & ILikeStaticMethods;

export const likeSchema = SchemaFactory.createForClass(Like);

likeSchema.method('updateLikeStatus', Like.prototype.updateLikeStatus);
likeSchema.static('createLikeEntity', Like.createLikeEntity);
