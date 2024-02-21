import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(name?: string): Promise<User[]> {
    if (!name) return this.prisma.user.findMany();

    return this.prisma.user.findMany({ where: { name: name } });
  }

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(user: User): Promise<User> {
    return this.prisma.user.create({ data: user });
  }
}
