import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configService } from './config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './main/customer/customer.module';
import { AddressModule } from './main/address/address.module';
import { AuthModule } from './main/auth/auth.module';
import { CustomerFavModule } from './main/customer-fav/customer-fav.module';
import { CustomerAffairModule } from './main/customer-affair/customer-affair.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomerModule,
    AddressModule,
    AuthModule,
    CustomerFavModule,
    CustomerAffairModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
