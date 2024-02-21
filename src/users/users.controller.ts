import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
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

  @Put(':id') updateUser(@Param('id') id: string, @Body() data: User): Promise<User> {
    return this.usersService.updateUser(Number(id), data);
  }

  @Delete(':id') deleteUser(@Param('id') id: string): Promise<User> {
    return this.usersService.deleteUser(Number(id));
  }
}
