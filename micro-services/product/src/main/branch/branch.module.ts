import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from 'src/entity/branch.entity';
import { BranchController } from './branch.controller';
import { BranchRepository } from './branch.repository';
import { BranchService } from './branch.service';
import { BranchSagaController } from './branch.saga.controller';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Branch.name,
        schema: BranchSchema,
      },
    ]),
  ],
  controllers: [BranchController, BranchSagaController],
  providers: [BranchService, BranchRepository, kafkaClientManager],
  exports: [BranchRepository],
})
export class BranchModule {}
