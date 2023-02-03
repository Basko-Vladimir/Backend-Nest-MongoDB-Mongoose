import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { CreateBlogDto } from '../src/blogs/dto/create-blog.dto';
import { UpdateBlogDto } from '../src/blogs/dto/update-blog.dto';

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

export const updatedBlogData: UpdateBlogDto = {
  name: 'Updated Blog',
  description: 'New description',
  websiteUrl: 'https://new-site.io',
};

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
