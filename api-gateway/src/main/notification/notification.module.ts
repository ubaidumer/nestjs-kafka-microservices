import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  controllers: [NotificationController],
})
export class NotificationModule {}
