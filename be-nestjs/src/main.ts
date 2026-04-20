import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    // Validate
    new ValidationPipe({
      whitelist: true, // Loại bỏ các trường không được định nghĩa trong DTO
      forbidNonWhitelisted: true, // Nếu có trường không được định nghĩa trong DTO thì trả về lỗi
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
      stopAtFirstError: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
