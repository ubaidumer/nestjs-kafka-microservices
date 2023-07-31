import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  controllers: [OrderController],
})
export class OrderModule {}
