import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // Nên tạo .env
      url: 'postgresql://postgres.skcbelnlziouifuhbkmv:Top1yasuo20k1@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true',
      entities: [User],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
