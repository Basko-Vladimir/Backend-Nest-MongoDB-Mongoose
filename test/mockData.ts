import { CreateBlogDto } from '../src/blogs/dto/create-blog.dto';
import { IFullPostOutputModel } from '../src/posts/dto/posts-output-models.dto';
import { LikeStatus } from '../src/common/enums';
import { CreatePostDto } from '../src/posts/dto/create-post.dto';
import { IBlogOutputModel } from '../src/blogs/dto/blogs-output-models.dto';
import { FullCommentOutputModel } from '../src/comments/dto/comments-output-models.dto';
import { IUserOutputModel } from '../src/users/dto/users-output-models.dto';
import { CreateCommentDto } from '../src/comments/dto/create-comment.dto';

interface Exception {
  statusCode: number;
  message: string;
}

export const INVALID_ID = '63d6f799999997d58f77bc1f';

export const auth = {
  incorrectBasicCredentials: { Authorization: 'Basic YWRtaW46cXdlcnR1' },
  correctBasicCredentials: { Authorization: 'Basic YWRtaW46cXdlcnR5' },
  incorrectAccessToken:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2M2VlNTE2MmMwZTNmM2IyNzYyYzQ1OTkiLCJpYXQiOjE2NzY1NjI3OTI0ODAsImV4cCI6MTY3NjU2Mjc5MzA4MH0.llZ9JpK1c6IyHHw49lArN27g1wk6wE_qPGrbTIcz8SA',
};

export const users = {
  correctCreateUserDtos: [
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
  ],
  incorrectUsersDtos: [
    {},
    {
      login: '',
      password: '',
      email: '',
    },
    {
      login: '   ',
      password: '   ',
      email: '   ',
    },
    {
      login: 'aaa;kdl/',
      password: '123',
      email: 'aaaa@sdsds',
    },
  ],
  usersBadQueryResponse: {
    errorsMessages: [
      { message: expect.any(String), field: 'login' },
      { message: expect.any(String), field: 'password' },
      { message: expect.any(String), field: 'email' },
    ],
  },
};

export const blogs = {
  correctCreateBlogDtos: [
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
  ],
  correctUpdateBlogDto: {
    name: 'Updated Blog',
    description: 'New description for blog Blog',
    websiteUrl: 'https://new-site.io',
  },
  incorrectBlogsDtos: [
    {},
    {
      name: '',
      websiteUrl: '',
      description: '',
    },
    {
      name: '   ',
      websiteUrl: '   ',
      description: '   ',
    },
    {
      name: 'name length 16 test test',
      websiteUrl: 'blog.com',
      description:
        '500+_Length_1GjrgergpmmpmKMKLjioememfOyJdTHB0cI9iW8GmbmPsd7O70PS4BdopkHksGCWm3KxPzkbQP3e5kE9yqLVEjqwroaoOqGwSftpKiVQfYwdZEW0101_Length_1GjrgergpmmpmKMKLjioememfOyJdTHB0cI9iW8GmbmPsd7O70PS4BdopkHksGCWm3KxPzkbQP3e5kE9yqLVEjqwroaoOqGwSftpKiVQfYwdZEW0101_Length_1GjrgergpmmpmKMKLjioememfOyJdTHB0cI9iW8GmbmPsd7O70PS4BdopkHksGCWm3KxPzkbQP3e5kE9yqLVEjqwroaoOqGwSftpKiVQfYwdZEW0101_Length_1GjrgergpmmpmKMKLjioememfOyJdTHB0cI9iW8GmbmPsd7O70PS4BdopkHksGCWm3KxPzkbQP3e5kE9yqLVEjqwroaoOqGwSftpKiVQfYwdZEW0101_Length_1GjrgergpmmpmKMKLjioememfOyJdTHB0cI9iW8GmbmPsd7O70PS4BdopkHksGCWm3KxPzkbQP3e5kE9yqLVEjqwroaoOqGwSftpKiVQfYwdZEW0',
    },
  ],
  incorrectBlogsIds: ['', '   ', '2156165465', INVALID_ID],
  getCreatedBlogItem: (createBlogDto: CreateBlogDto): IBlogOutputModel => ({
    id: expect.any(String),
    name: createBlogDto.name,
    description: createBlogDto.description,
    websiteUrl: createBlogDto.websiteUrl,
    isMembership: false,
    createdAt: expect.any(String),
  }),
  blogsBadQueryResponse: {
    errorsMessages: [
      { message: expect.any(String), field: 'name' },
      { message: expect.any(String), field: 'websiteUrl' },
      { message: expect.any(String), field: 'description' },
    ],
  },
};

export const posts = {
  correctCreatePostDtos: [
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
  ],
  correctUpdatePostDto: {
    title: 'Post is UPDATED',
    content: 'New UPDATED content for blog Post',
    shortDescription: 'UPDATED short description',
  },
  incorrectPostsDtos: [
    {},
    {
      title: '',
      shortDescription: '',
      content: '',
    },
    {
      title: '    ',
      shortDescription: '    ',
      content: '    ',
    },
    {
      title: '30+_length_oqWPBjPIDCZsSmJTRi360TZWxXgTY0Y',
      shortDescription:
        '100+_length_TPiCDkcFTUlci5EixvHxj4fOT8KfKrGqZM3jjuvhPMEC2h1hanimil9ScG7XIvxVbYQIGUkAIKGz5lflHDZdo6rfqax6ZWZ1ZAJ5O',
      content:
        '1000+_length_SgqITcVIF19oeUkBqeHjwyCAayeJMIYFqPRyUaWXi2cRZqFQww3L6k3WnHpsqDYmMTEYEcyEKnEHwdwRmih2ijgycdocxRckEgq0hmoSxZOWSEjaivxLNpZUTmToVRpzc52xzPs33744NDdPiZBPuLN36NzGvMZowAmfhDeAjkNCAw6OLSRBab4T4mX1T6t4ctsSEQSNChOF3zyaCUUZkrG9R89nWOGpWYT4cDVxZFwBplv9w3PZpuML0u1Rt1M3fCVxBwBOyK4D78DNY8iOizf9ifyLm77VCKUQMqrxpuuGE8hpEDp1z6bYOkphJ2S8yxwurb4vhu4JqNtnQDJBJGTYqwC6MHwkJby9dYAKiTXFaMXWZoKyvkTudEGcOc5XZrhgKZUnIeNQbMwHTsggOf0cYejIIsdeIMd7uIoOEHxmMUSvNeHnQfnJUELNb5Y5gSMTqdt3x2l0OnIDvlbjivh8H5ngaLEsuzbHlN4jaIqd50Mz1JWjsgqZYn3A2s5LtG6N7hmrXhZiwM7Ay1fvIZv9u5fvjAFSTBtdwMTw6wyAc4OlSNppC56OtqmuOgW60vQF0ByTRUOkIIpDtsOzB4OYiJI2zoAP2oML3WUzodxvyb0KmRByBcu2Uo3ImxckdKdssa4DXoEvNnBpVBm9N0ts475rUx2GhkPq7DjdMVaUw87ilCCwhHbcd09i51nkGTeYQH2z30W0C1BcB1EP4KugrGKu5o5LfCDuorKRo6FTFKJSOCXgIWo9i6LntCYeS2UNSXdD3HRprUhuNeC6sZ2yRF1aKpGr4gczF14yTlMiy7rDMovbPvlNaZWZ8Rj8Dk6bEL3H3Y9DTXiOBgdo8GjTDYgmBoHHfGhQnA2rBaX8VeboZm8Ut5Ipgt966czLAMFemNlSf3FAmNLaqW4QIlodUALO8L1jzvIBaa2KbY88RH8Er9ruzGEjkwvZHFl7oAjoTK9DOmvYQlxW1qX040Ng4tFA2Stam2udqPb1\n',
    },
  ],
  postsBadQueryResponse: {
    errorsMessages: [
      { message: expect.any(String), field: 'title' },
      { message: expect.any(String), field: 'shortDescription' },
      { message: expect.any(String), field: 'content' },
    ],
  },
  getCreatedPostItem: (
    createPostDto: Omit<CreatePostDto, 'blogId'>,
    currentBlog: IBlogOutputModel,
  ): IFullPostOutputModel => ({
    id: expect.any(String),
    blogId: currentBlog.id,
    blogName: currentBlog.name,
    content: createPostDto.content,
    title: createPostDto.title,
    shortDescription: createPostDto.shortDescription,
    createdAt: expect.any(String),
    extendedLikesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.NONE,
      newestLikes: [],
    },
  }),
};

export const comments = {
  correctCreateCommentDtos: [
    { content: 'Comment 1 content 111111111111111111111' },
    { content: 'Comment 2 content 222222222222222222222' },
    { content: 'Comment 3 content 333333333333333333333' },
  ],
  incorrectCommentsDtos: [
    {},
    { content: '' },
    { content: '       ' },
    { content: 'short content' },
    {
      content:
        '300+_length_eFoDB9ejBSUWfoUrrx6CPhAHOBFTuCh0TSZTBbG8r4dFacjCnqafE8iwp76MUtzbDhL2OKbCbh4jWziALBrN0jzHarFMYF9EEDfqYkFHMVOzUyuK7rUrzYy2gC0I3EBlh5VMvsJGNojmUWGO6RRGcZ3YR8AstidHPZvwGBsd0kztom7qPmAndoxLCoA1ESK2oMt6CgydQVvDakFCaxW9DAXUi7XbDHankglDrNvSjqHBs7m1FGedGg1ND8hMvmn3K0BbWQSeoA4AeOmk7f3BsISpsWxlRkGCUcZiLTReWP4z\n',
    },
  ],
  commentsBadQueryResponse: {
    errorsMessages: [{ message: expect.any(String), field: 'content' }],
  },
  getCreatedCommentItem: (
    content: string,
    userLogin: string,
  ): FullCommentOutputModel => ({
    id: expect.any(String),
    content,
    commentatorInfo: {
      userId: expect.any(String),
      userLogin,
    },
    createdAt: expect.any(String),
    likesInfo: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.NONE,
    },
  }),
};

export const errors: { [key: string]: Exception } = {
  notFoundException: {
    statusCode: 404,
    message: 'Not Found',
  },
  unauthorisedException: {
    statusCode: 401,
    message: 'Unauthorized',
  },
};

export const defaultResponses = {
  defaultGetAllResponse: {
    page: 1,
    pageSize: 10,
    pagesCount: 0,
    totalCount: 0,
    items: [],
  },
  getAllItemsWithPage2Size1: <I, O>(matchedItem: I): O => {
    return {
      page: 2,
      pageSize: 1,
      pagesCount: 3,
      totalCount: 3,
      items: [matchedItem as I],
    } as O;
  },
};
