import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query('name') name?: string): Promise<User[]> {
    return this.usersService.getAllUsers(name);
  }

  @Get(':id') getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(Number(id));
  }

  @Post() createUser(@Body() data: User): Promise<User> {
    return this.usersService.createUser(data);
  }
}
