import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { take } from 'rxjs';
import { ProductService } from './product.service';

// Routes for Auth Api's
@Controller()
export class ProductSagaController {
  constructor(private readonly productService: ProductService) {}

  // add total paid ammount into product revenue
  @MessagePattern('saga-topic-order-to-product-updateProduct')
  async updateCustomeralternatePhoneNumber(@Payload() payload) {
    return await this.productService.addRevenueInProducts(payload);
  }
}
