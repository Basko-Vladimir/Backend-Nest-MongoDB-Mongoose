export const INVALID_ID = '63d6f799999997d58f77bc1f';

export const users = [
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

export const blogs = [
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

export const updatedBlogData = {
  name: 'Updated Blog',
  description: 'New description',
  websiteUrl: 'https://new-site.io',
};

export const notFoundException = {
  statusCode: 404,
  message: 'Not Found',
};
