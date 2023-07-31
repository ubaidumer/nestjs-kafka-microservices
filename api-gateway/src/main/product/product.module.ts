import { Module } from '@nestjs/common';
import { productController } from './product.controller';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  controllers: [productController],
})
export class ProductModule {}
