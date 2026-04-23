import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly em: EntityManager) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'chuabietghigivaoday123123',
    });
  }

  async validate(payload: { userId: number; username: string }) {
    const user = await this.em.findOne(
      User,
      { id: payload.userId },
      { fields: ['id', 'username'] },
    );
    if (!user) {
      throw new UnauthorizedException('Không tìm thấy người dùng này!');
    }
    return user;
  }
}
