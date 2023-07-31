import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from 'src/entity/product.entity';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { AwsService } from 'src/utils/aws.service';
import { CategoryModule } from '../category/category.module';
import { BranchModule } from '../branch/branch.module';
import { ProductSagaController } from './product.saga.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { AddonsModule } from '../addons/addons.module';

// Separation of concerns are handled using imports,exports,controllers and providers array
@Module({
  imports: [
    CategoryModule,
    AddonsModule,
    BranchModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
    ]),
  ],
  controllers: [ProductController, ProductSagaController],
  providers: [ProductService, ProductRepository, AwsService],
})
export class ProductModule {}
