import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { CreateBlogDto } from '../src/blogs/dto/create-blog.dto';
import { UpdateBlogDto } from '../src/blogs/dto/update-blog.dto';
import { IFullPostOutputModel } from '../src/posts/dto/posts-output-models.dto';
import { LikeStatus } from '../src/common/enums';
import { CreatePostDto } from '../src/posts/dto/create-post.dto';
import { IBlogOutputModel } from '../src/blogs/dto/blogs-output-models.dto';

interface Exception {
  statusCode: number;
  message: string;
}

export const INVALID_ID = '63d6f799999997d58f77bc1f';

export const users: CreateUserDto[] = [
  {
    login: 'User1',
    password: '111111',
    email: 'user1@gmail.com',
  },
  {
    login: 'User2',
    password: '222222',
    email: 'user2@gmail.com',
  },
  {
    login: 'User3',
    password: '333333',
    email: 'user3@gmail.com',
  },
];

export const blogs: CreateBlogDto[] = [
  {
    name: 'Blog1',
    description: 'Lorem ipsum dolor sit amet #1.',
    websiteUrl: 'https://blog-test1.com',
  },
  {
    name: 'Blog2',
    description: 'Lorem ipsum dolor sit amet #2.',
    websiteUrl: 'https://blog-test2.com',
  },
  {
    name: 'Blog3',
    description: 'Lorem ipsum dolor sit amet #3.',
    websiteUrl: 'https://blog-test3.com',
  },
];

export const getCreatedBlogItem = (
  createBlogDto: CreateBlogDto,
): IBlogOutputModel => ({
  id: expect.any(String),
  name: createBlogDto.name,
  description: createBlogDto.description,
  websiteUrl: createBlogDto.websiteUrl,
  createdAt: expect.any(String),
});

export const updatedBlogData: UpdateBlogDto = {
  name: 'Updated Blog2',
  description: 'New description for blog Blog2',
  websiteUrl: 'https://new-site.io',
};

export const posts: Omit<CreatePostDto, 'blogId'>[] = [
  {
    title: 'Post1',
    shortDescription: 'short description of Post1',
    content: 'Post1 Post1 Post1 Post1 Post1 Post1 Post1 Post1 Post1 Post1',
  },
  {
    title: 'Post2',
    shortDescription: 'short description of Post2',
    content: 'Post2 Post2 Post2 Post2 Post2 Post2 Post2 Post2 Post2 Post2',
  },
  {
    title: 'Post3',
    shortDescription: 'short description of Post3',
    content: 'Post3 Post3 Post3 Post3 Post3 Post3 Post3 Post3 Post3 Post3',
  },
];

export const getCreatedPostItem = (
  createPostDto: Omit<CreatePostDto, 'blogId'>,
  currentBlog: IBlogOutputModel,
): IFullPostOutputModel => ({
  id: expect.any(String),
  blogId: currentBlog.id,
  blogName: currentBlog.name,
  content: posts[0].content,
  title: posts[0].title,
  shortDescription: posts[0].shortDescription,
  createdAt: expect.any(String),
  extendedLikesInfo: {
    likesCount: 0,
    dislikesCount: 0,
    myStatus: LikeStatus.NONE,
    newestLikes: [],
  },
});

export const notFoundException: Exception = {
  statusCode: 404,
  message: 'Not Found',
};

export const defaultGetAllResponse = {
  page: 1,
  pageSize: 10,
  pagesCount: 0,
  totalCount: 0,
  items: [],
};

export const getAllItemsWithPage2Size1 = <I, O>(matchedItem: I): O => {
  return {
    page: 2,
    pageSize: 1,
    pagesCount: 3,
    totalCount: 3,
    items: [matchedItem as I],
  } as O;
};
