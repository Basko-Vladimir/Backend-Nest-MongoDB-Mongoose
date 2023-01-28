import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(protected usersService: UsersService) {}

  @Get()
  async findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Post()
  async createUser() {
    return this.usersService.createUser();
  }

  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    return this.usersService.deleteUser(userId);
  }
}
