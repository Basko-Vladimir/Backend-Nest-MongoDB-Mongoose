import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { commentsConstants } from '../../common/constants';
import { generateLengthErrorMessage } from '../../common/error-messages';
import { CreateCommentDto } from '../dto/create-comment.dto';

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

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  static createCommentEntity(
    createCommentDto: CreateCommentDto,
    CommentModel: CommentModelType,
  ): CommentDocument {
    return new CommentModel(createCommentDto);
  }
}

export type CommentDocument = HydratedDocument<Comment>;

export interface ICommentStaticMethods {
  createCommentEntity(
    createCommentDto: CreateCommentDto,
    CommentModel: CommentModelType,
  ): CommentDocument;
}

export type CommentModelType = Model<Comment> & ICommentStaticMethods;

export const commentSchema = SchemaFactory.createForClass(Comment);

commentSchema.static('createCommentEntity', Comment.createCommentEntity);
