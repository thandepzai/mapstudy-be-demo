import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Request } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  findOne(@Req() req: Request & { user: User }) {
    return req.user;
  }
}
