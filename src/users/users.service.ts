import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {}

  async findAllUsers() {
    return this.usersRepository.findAllUsers();
  }

  async createUser() {
    return this.usersRepository.saveUser();
  }

  async deleteUser(userId: string) {
    return this.usersRepository.deleteUser(userId);
  }
}
