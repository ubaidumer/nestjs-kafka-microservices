import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from 'src/entity/voucher.entity';
import { VoucherController } from './voucher.controller';
import { VoucherRepository } from './voucher.repository';
import { VoucherService } from './voucher.service';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Voucher.name,
        schema: VoucherSchema,
      },
    ]),
  ],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherRepository],
})
export class VoucherModule {}
