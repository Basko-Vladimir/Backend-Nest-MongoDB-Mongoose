import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, now, Types } from 'mongoose';
import { generateLengthErrorMessage } from '../../common/error-messages';
import { postsConstants, MIN_STRINGS_LENGTH } from '../../common/constants';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

const { MAX_TITLE_LENGTH, MAX_SHORT_DESCRIPTION_LENGTH, MAX_CONTENT_LENGTH } =
  postsConstants;

@Schema({ timestamps: true })
export class Post {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [
      MIN_STRINGS_LENGTH,
      generateLengthErrorMessage('title', MIN_STRINGS_LENGTH, 'min'),
    ],
    maxlength: [
      MAX_TITLE_LENGTH,
      generateLengthErrorMessage('title', MAX_TITLE_LENGTH, 'max'),
    ],
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [
      MIN_STRINGS_LENGTH,
      generateLengthErrorMessage('shortDescription', MIN_STRINGS_LENGTH, 'min'),
    ],
    maxlength: [
      MAX_SHORT_DESCRIPTION_LENGTH,
      generateLengthErrorMessage(
        'shortDescription',
        MAX_SHORT_DESCRIPTION_LENGTH,
        'max',
      ),
    ],
  })
  shortDescription: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: [
      MIN_STRINGS_LENGTH,
      generateLengthErrorMessage('content', MIN_STRINGS_LENGTH, 'min'),
    ],
    maxlength: [
      MAX_CONTENT_LENGTH,
      generateLengthErrorMessage('content', MAX_CONTENT_LENGTH, 'max'),
    ],
  })
  content: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  blogName: string;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  blogId: Types.ObjectId;

  @Prop({
    default: now(),
  })
  createdAt: Date;

  @Prop({
    default: now(),
  })
  updatedAt: Date;

  updatePost(
    updatingData: UpdatePostDto,
    currentPost: PostDocument,
  ): PostDocument {
    // const { name, websiteUrl, description } = updatingData;
    //
    // currentPost.name = name;
    // currentPost.websiteUrl = websiteUrl;
    // currentPost.description = description;

    return currentPost;
  }

  static createPostEntity(
    postData: CreatePostDto,
    PostModel: PostModelType,
  ): PostDocument {
    return new PostModel(postData);
  }
}

export type PostDocument = HydratedDocument<Post>;

export interface IPostsStaticMethods {
  createPostEntity(
    postData: CreatePostDto,
    PostModel: PostModelType,
  ): PostDocument;
}

export type PostModelType = Model<Post> & IPostsStaticMethods;

export const postSchema = SchemaFactory.createForClass(Post);

postSchema.method('updatePost', Post.prototype.updatePost);
postSchema.static('createPostEntity', Post.createPostEntity);
