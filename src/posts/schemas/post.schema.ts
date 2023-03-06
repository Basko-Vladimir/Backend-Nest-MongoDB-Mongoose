import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { generateLengthErrorMessage } from '../../common/error-messages';
import { postsConstants, MIN_STRINGS_LENGTH } from '../../common/constants';
import { CreatePostDto } from '../api/dto/create-post.dto';
import { UpdatePostDto } from '../api/dto/update-post.dto';

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

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  updatePost(
    updatingData: UpdatePostDto,
    currentPost: PostDocument,
  ): PostDocument {
    const { title, content, shortDescription, blogId } = updatingData;

    currentPost.title = title;
    currentPost.content = content;
    currentPost.shortDescription = shortDescription;
    currentPost.blogId = new Types.ObjectId(blogId);

    return currentPost;
  }

  static createPostEntity(
    postData: CreatePostDto,
    blogName: string,
    PostModel: PostModelType,
  ): PostDocument {
    return new PostModel({ ...postData, blogName });
  }
}

export type PostDocument = HydratedDocument<Post>;

interface IPostStaticMethods {
  createPostEntity(
    postData: CreatePostDto,
    blogName: string,
    PostModel: PostModelType,
  ): PostDocument;
}

export type PostModelType = Model<Post> & IPostStaticMethods;

export const postSchema = SchemaFactory.createForClass(Post);

postSchema.method('updatePost', Post.prototype.updatePost);
postSchema.static('createPostEntity', Post.createPostEntity);
