import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FcmToken, FcmTokenSchema } from 'src/entity/fcm-token.entity';
import { FcmTokenController } from './fcmtoken.controller';
import { FcmTokenRepository } from './fcmtoken.repository';
import { FcmTokenService } from './fcmtoken.service';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: FcmToken.name,
        schema: FcmTokenSchema,
      },
    ]),
  ],
  controllers: [FcmTokenController],
  providers: [FcmTokenService, FcmTokenRepository],
  exports: [FcmTokenService, FcmTokenRepository],
})
export class FcmTokenModule {}
