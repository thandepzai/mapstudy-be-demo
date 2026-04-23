import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [MikroOrmModule.forFeature([User]), JwtModule.register({})],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
