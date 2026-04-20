import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Người dùng với ID ${id} không tồn tại`);
    }

    const {
      password: _,
      refresh_token: __,
      ...userWithoutSensitiveInfo
    } = user;

    return userWithoutSensitiveInfo;
  }
}
