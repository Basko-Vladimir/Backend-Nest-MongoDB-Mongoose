import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument, PostModelType } from '../schemas/post.schema';
import { getFilterByDbId } from '../../common/utils';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) protected PostModel: PostModelType) {}

  async findPostById(id: string): Promise<PostDocument> {
    const targetPost = await this.PostModel.findById(id);

    if (!targetPost) throw new NotFoundException();

    return targetPost;
  }

  async savePost(post: PostDocument): Promise<PostDocument> {
    return post.save();
  }

  async deletePost(id: string): Promise<void> {
    const { deletedCount } = await this.PostModel.deleteOne(
      getFilterByDbId(id),
    );

    if (!deletedCount) throw new NotFoundException();
  }
}
