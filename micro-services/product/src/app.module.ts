import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AddonsModule } from './main/addons/addons.module';
import { BranchModule } from './main/branch/branch.module';
import { CategoryModule } from './main/category/category.module';
import { MenuModule } from './main/menu/menu.module';
import { ProductModule } from './main/product/product.module';
import { VoucherModule } from './main/vocher/voucher.module';
import { AwsService } from './utils/aws.service';
import { BannerModule } from './main/banner/banner.module';

//  config all module here to access all endpoints.... and config database here
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGOURL),
    ProductModule,
    BranchModule,
    CategoryModule,
    MenuModule,
    VoucherModule,
    AddonsModule,
    BannerModule,
  ],
  controllers: [],
  providers: [AwsService],
})
export class AppModule {}
