import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from 'src/entity/admin.entity';
import { AdminRepository } from './admin.repository';
import { AuthSagaController } from './admin.saga.controll';
import { AdminService } from './admin.service';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminService, AdminRepository],
  controllers: [AuthSagaController],
  exports: [AdminService, AdminRepository],
})
export class AdminModule {}
