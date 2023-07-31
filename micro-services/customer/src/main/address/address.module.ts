import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'src/entity/address.entity';
import { AuthModule } from '../auth/auth.module';
import { AddressController } from './address.controller';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Address])],
  controllers: [AddressController],
  providers: [AddressService, AddressRepository],
})
export class AddressModule {}
