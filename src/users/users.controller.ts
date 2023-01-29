import {
  Controller,
  Param,
  Body,
  HttpCode,
  Delete,
  Get,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  IUserOutputModel,
  mapDbUserToUserOutputModel,
} from './mappers/users-mappers';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IUserOutputModel> {
    const savedUser = await this.usersService.createUser(createUserDto);

    return mapDbUserToUserOutputModel(savedUser);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteUser(@Param('id') userId: string): Promise<void> {
    await this.usersService.deleteUser(userId);
  }
}
