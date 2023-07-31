import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  controllers: [AdminController],
})
export class AdminModule {}
