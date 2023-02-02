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
}

export type LikeDocument = HydratedDocument<Like>;

export type LikeModelType = Model<Like>;

export const likeSchema = SchemaFactory.createForClass(Like);
