import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AddOns, AddOnsSchema } from 'src/entity/addOns.entity';
import { AwsService } from 'src/utils/aws.service';
import { AddOnsController } from './addons.controller';
import { AddonsRepository } from './addons.repository';
import { AddonsService } from './addons.services';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: AddOns.name,
        schema: AddOnsSchema,
      },
    ]),
  ],
  controllers: [AddOnsController],
  providers: [AddonsService, AddonsRepository, AwsService],
  exports: [AddonsRepository],
})
export class AddonsModule {}
