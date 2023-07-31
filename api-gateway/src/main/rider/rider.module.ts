import { Module } from '@nestjs/common';
import { RiderController } from './rider.controller';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  controllers: [RiderController],
})
export class RiderModule {}
