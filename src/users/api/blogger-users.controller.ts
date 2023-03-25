import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard';
import { checkParamIdPipe } from '../../common/pipes/check-param-id-pipe.service';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserBanStatusForBlogDto } from './dto/update-user-ban-status-for-blog.dto';
import { UpdateUserBanStatusForBlogCommand } from '../application/use-cases/update-user-ban-status-for-blog.useCase';

@Controller('blogger/users')
export class BloggerUsersController {
  constructor(private commandBus: CommandBus) {}

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
