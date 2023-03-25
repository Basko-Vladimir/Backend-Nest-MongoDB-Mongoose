import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserBanStatusForBlogDto } from './dto/update-user-ban-status-for-blog.dto';
import { UpdateUserBanStatusForBlogCommand } from '../application/use-cases/update-user-ban-status-for-blog.useCase';
import { AllBannedUsersForSpecificBlogOutputModel } from './dto/banned-users-for-specific-blog-output-model.dto';
import { BannedUsersForSpecificBlogQueryParamsDto } from './dto/banned-users-for-specific-blog-query-params.dto';
import { QueryBloggerUsersRepositoryService } from '../infrastructure/query-blogger-users-repository.service';

@Controller('blogger/users')
export class BloggerUsersController {
  constructor(
    private commandBus: CommandBus,
    private queryBloggerUsersRepositoryService: QueryBloggerUsersRepositoryService,
  ) {}

  @Get('blog/:id')
  @UseGuards(AuthGuard)
  async findBannedUsersForSpecificBlog(
    @Param('id', checkParamIdPipe) blogId: string,
    @Query() queryParams: BannedUsersForSpecificBlogQueryParamsDto,
  ): Promise<AllBannedUsersForSpecificBlogOutputModel> {
    return this.queryBloggerUsersRepositoryService.findAllBannedUsersForSpecificBlog(
      blogId,
      queryParams,
    );
  }

  @Put(':id/ban')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async updateUserBanStatusForBlog(
    @Param('id', checkParamIdPipe) userId: string,
    @Body() updateUserBanStatusForBlogDto: UpdateUserBanStatusForBlogDto,
  ): Promise<void> {
    return this.commandBus.execute(
      new UpdateUserBanStatusForBlogCommand(
        userId,
        updateUserBanStatusForBlogDto,
      ),
    );
  }
}
