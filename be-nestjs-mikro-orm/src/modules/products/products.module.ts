import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature([Product]), AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
