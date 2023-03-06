import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { BlogsQueryParamsDto } from './dto/blogs-query-params.dto';
import { AllBlogsForAdminOutputModel } from './dto/blogs-output-models.dto';
import { QueryBlogsRepository } from '../infrastructure/query-blogs.repository';
import { BindBlogWithUserGuard } from '../../common/guards/bind-blog-with-user.guard';
import { CommandBus } from '@nestjs/cqrs';
import { BindBlogWithUserCommand } from '../application/use-cases/bind-blog-with-user.useCase';
import { UserDocument } from '../../users/schemas/user.schema';
import { BlogDocument } from '../schemas/blog.schema';
import { Blog } from '../../common/decorators/blog.decorator';
import { User } from '../../common/decorators/user.decorator';

@Controller('sa/blogs')
export class AdminBlogsController {
  constructor(
    private queryBlogsRepository: QueryBlogsRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAllBlogsAsAdmin(
    @Query() query: BlogsQueryParamsDto,
  ): Promise<AllBlogsForAdminOutputModel> {
    return this.queryBlogsRepository.findAllBlogsAsAdmin(query);
  }

  @Put(':id/bind-with-user/:userId')
  @UseGuards(AuthGuard, BindBlogWithUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async bindBlogWithUser(
    @User() user: UserDocument,
    @Blog() blog: BlogDocument,
  ): Promise<void> {
    return this.commandBus.execute(new BindBlogWithUserCommand(blog, user));
  }
}
