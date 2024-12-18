import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto) {
    return this.cartService.create(createCartDto);
  }

  @Get()
  findAll() {
    return this.cartService.findAll();
  }

  @Post(':cartid/product/:productsku')
  addProduct(@Param('cartid') cartid: string, @Param('productsku') productsku: string){
    return this.cartService.addProduct(+cartid, +productsku);
  }
  
  @Delete(':cartid/product/:productsku')
  removePlayer(@Param('cartid') cartid: string, @Param('productsku') productsku: string){
    return this.cartService.removeProduct(+cartid, +productsku);
  }

  @Delete(':cartid/products')
  removeAllProducts(@Param('cartid') cartid: string) {
    return this.cartService.removeAllProducts(+cartid);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
