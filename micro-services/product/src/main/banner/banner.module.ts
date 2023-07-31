import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from 'src/entity/banner.entity';
import { BannerController } from './banner.controller';
import { BannerRepository } from './banner.repository';
import { BannerService } from './banner.service';
import { AwsService } from 'src/utils/aws.service';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Banner.name,
        schema: BannerSchema,
      },
    ]),
  ],
  controllers: [BannerController],
  providers: [BannerService, BannerRepository, AwsService],
  exports: [BannerRepository],
})
export class BannerModule {}
