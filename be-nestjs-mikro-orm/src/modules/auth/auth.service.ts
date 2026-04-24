import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDto } from './dto/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.em.findOne(User, {
      $or: [{ email: dto.email }, { username: dto.username }],
    });

    if (existing) {
      throw new ConflictException('Email hoặc Tên đăng nhập đã tồn tại!');
    }

    // Tạo instance mới (Entity sẽ tự hash password qua @BeforeCreate)
    const user = this.em.create(User, dto);

    // persist theo dõi đối tượng trước khi lưu vào db
    this.em.persist(user);
    // Lưu vào DB
    await this.em.flush();

    return user;
  }

  async getTokens(userId: number, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { userId, username },
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
    await this.em.nativeUpdate(
      User,
      { id: userId },
      { refresh_token: refreshToken },
    );
  }

  async login(dto: LoginDto) {
    const user = await this.em.findOne(User, { username: dto.username });
    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    const tokens = await this.getTokens(user.id, user.username);

    user.refresh_token = tokens.refreshToken;
    await this.em.flush();

    return { ...wrap(user).toObject(), ...tokens };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const user = await this.em.findOne(User, {
      id: refreshTokenDto.userId,
      refresh_token: refreshTokenDto.refreshToken,
    });
    if (!user) throw new UnauthorizedException('Không tồn tại người dùng');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
}
