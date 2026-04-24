import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly em: EntityManager) {}

  async create(dto: CreateProductDto, user: User) {
    const product = this.em.create(Product, {
      ...dto,
      createdBy: user,
    });

    this.em.persist(product);
    await this.em.flush();
    return product;
  }

  async findAll() {
    return this.em.find(
      Product,
      {},
      {
        populate: ['createdBy'],
        orderBy: { created_at: 'DESC' },
      },
    );
  }

  async findOne(id: number) {
    return this.em.findOne(Product, { id }, { populate: ['createdBy'] });
  }

  async remove(id: number, user: User) {
    const product = await this.em.findOne(
      Product,
      { id },
      { populate: ['createdBy'] },
    );

    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    if (product.createdBy.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xóa sản phẩm này');
    }

    this.em.remove(product);
    await this.em.flush();
    return { message: 'Xóa thành công' };
  }

  async update(id: number, dto: UpdateProductDto, user: User) {
    const product = await this.findOne(id);

    if (product.createdBy.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền sửa sản phẩm này');
    }

    wrap(product).assign(dto);
    await this.em.flush();
    return product;
  }
}
