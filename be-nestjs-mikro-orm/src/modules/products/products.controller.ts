import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../users/entities/user.entity';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateProductDto, @Req() req: Request & { user: User }) {
    return this.productsService.create(dto, req.user);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: Request & { user: User },
  ) {
    return this.productsService.update(+id, dto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request & { user: User }) {
    return this.productsService.remove(+id, req.user);
  }
}
