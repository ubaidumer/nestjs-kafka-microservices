import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  controllers: [CustomerController],
})
export class CustomerModule {}
