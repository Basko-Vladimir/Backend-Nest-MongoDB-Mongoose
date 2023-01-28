import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  async findAllUsers() {
    return [];
  }

  async saveUser() {
    return {};
  }

  async deleteUser(userId: string) {
    return userId;
  }
}
