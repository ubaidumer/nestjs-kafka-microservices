import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerFav } from 'src/entity/customer-fav.entity';
import { AuthModule } from '../auth/auth.module';
import { CustomerFavController } from './customer-fav.controller';
import { CustomerFavRepository } from './customer-fav.repository';
import { CustomerFavService } from './customer-fav.service';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([CustomerFav])],
  controllers: [CustomerFavController],
  providers: [CustomerFavService, CustomerFavRepository],
})
export class CustomerFavModule {}
