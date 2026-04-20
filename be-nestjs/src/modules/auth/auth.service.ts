import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async getTokens(userId: number, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { userId, username },
        // secret cho vào file .env
        { secret: 'chuabietghigivaoday123123', expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { userId, username },
        { secret: 'chuabietghigivaoday123123', expiresIn: '1d' },
      ),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.userRepository.update(userId, { refresh_token: refreshToken });
  }

  async login(username: string, pass: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new BadRequestException('Sai tài khoản hoặc mật khẩu');
    }

    const { password: _, refresh_token: __, ...userWithoutPassword } = user;

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return { ...userWithoutPassword, ...tokens };
  }

  async refreshToken(userId: number, refreshToken: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId, refresh_token: refreshToken },
    });
    if (!user) throw new ForbiddenException('Không tồn tại người dùng');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async register(dto: RegisterDto) {
    const userExists = await this.userRepository.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });

    if (userExists) {
      throw new BadRequestException('Tên tài khoản hoặc Email đã được sử dụng');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    const { password: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
}
