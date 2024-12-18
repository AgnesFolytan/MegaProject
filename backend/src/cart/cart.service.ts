import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartService {
  constructor(private readonly db: PrismaService) { }

  create(createCartDto: CreateCartDto) {
    return this.db.cart.create({
      data: createCartDto
    })
  }
  findAll() {
    return this.db.cart.findMany({
      include: {products: true}
    });
  }

  addProduct(cartid: number, productsku: number) {
    return this.db.cart.update({
      where: { id: cartid },
      data: { products: { connect: { sku: productsku } } }
    })
  }

  removeProduct(cartid: number, productsku: number) {
    return this.db.cart.update({
      where: { id: cartid },
      data: { products: { disconnect: { sku: productsku } } }
    })
  }

  removeAllProducts(cartid: number) {
    return this.db.cart.update({
      where: { id: cartid },
      data: { products: { set: [] } }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(id: number) {
    try {
      return await this.db.cart.delete({
        where: {
          id
        }
      })
    } catch {
      return undefined;
    }
  }
}
