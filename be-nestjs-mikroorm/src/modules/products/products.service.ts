import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { Product } from './entities/product.entity';
import { User } from '../users/entities/user.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly em: EntityManager) {}

  // 1. Thêm sản phẩm: Gắn user từ token vào createdBy
  async create(dto: CreateProductDto, user: User) {
    const product = this.em.create(Product, {
      ...dto,
      createdBy: user,
    });
    await this.em.persistAndFlush(product);
    return product;
  }

  // 2. Lấy danh sách: Dùng populate để lấy thêm thông tin người đăng (Phần 3: Populate)
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

  // 3. Xóa sản phẩm: Kiểm tra xem có đúng là chủ sở hữu không
  async remove(id: number, user: User) {
    const product = await this.em.findOne(
      Product,
      { id },
      { populate: ['createdBy'] },
    );

    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    // Kiểm tra quyền: ID người đăng phải khớp với ID người dùng hiện tại
    if (product.createdBy.id !== user.id) {
      throw new ForbiddenException('Bạn không có quyền xóa sản phẩm này');
    }

    await this.em.removeAndFlush(product);
    return { message: 'Xóa thành công' };
  }
}
