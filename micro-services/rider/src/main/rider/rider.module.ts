import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rider } from 'src/entity/rider.entity';
import { RiderRepository } from './rider.repository';
import { RiderService } from './rider.service';
import { Training } from 'src/entity/training.entity';
import { TrainingRepository } from './training.repository';
import { AwsService } from '../../utils/aws.service';
import { TrainingService } from './training.services';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [TypeOrmModule.forFeature([Rider, Training])],
  providers: [
    RiderService,
    RiderRepository,
    TrainingRepository,
    AwsService,
    TrainingService,
  ],
  exports: [RiderService, RiderRepository, TrainingRepository, TrainingService],
})
export class RiderModule {}
