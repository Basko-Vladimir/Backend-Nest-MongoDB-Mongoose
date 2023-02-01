import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Model, Types } from 'mongoose';
import { commentsConstants } from '../../common/constants';
import { generateLengthErrorMessage } from '../../common/error-messages';

@Schema({ timestamps: true })
export class Comment {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [
      commentsConstants.MIN_CONTENT_LENGTH,
      generateLengthErrorMessage(
        'content',
        commentsConstants.MIN_CONTENT_LENGTH,
        'min',
      ),
    ],
    maxlength: [
      commentsConstants.MAX_CONTENT_LENGTH,
      generateLengthErrorMessage(
        'content',
        commentsConstants.MAX_CONTENT_LENGTH,
        'max',
      ),
    ],
  })
  content: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  postId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  userLogin: string;

  @Prop({
    default: now(),
  })
  createdAt: Date;

  @Prop({
    default: now(),
  })
  updatedAt: Date;
}

export type CommentDocument = HydratedDocument<Comment>;

export type CommentModelType = Model<Comment>;

export const commentSchema = SchemaFactory.createForClass(Comment);
