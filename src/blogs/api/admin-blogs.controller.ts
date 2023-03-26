import { CommandBus } from '@nestjs/cqrs';
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
import { BindBlogWithUserCommand } from '../application/use-cases/bind-blog-with-user.useCase';
import { UserDocument } from '../../users/schemas/user.schema';
import { BlogDocument } from '../schemas/blog.schema';
import { Blog } from '../../common/decorators/blog.decorator';
import { User } from '../../common/decorators/user.decorator';
import { QueryAdminBlogsRepository } from '../infrastructure/query-admin-blogs.repository';

@Controller('sa/blogs')
@UseGuards(AuthGuard)
export class AdminBlogsController {
  constructor(
    private queryBlogsRepository: QueryBlogsRepository,
    private queryAdminBlogsRepository: QueryAdminBlogsRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async findAllBlogsAsAdmin(
    @Query() query: BlogsQueryParamsDto,
  ): Promise<AllBlogsForAdminOutputModel> {
    return this.queryAdminBlogsRepository.findAllBlogsAsAdmin(query);
  }

  @Put(':id/bind-with-user/:userId')
  @UseGuards(BindBlogWithUserGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async bindBlogWithUser(
    @User() user: UserDocument,
    @Blog() blog: BlogDocument,
  ): Promise<void> {
    return this.commandBus.execute(new BindBlogWithUserCommand(blog, user));
  }
}
