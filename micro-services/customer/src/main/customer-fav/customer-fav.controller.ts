import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { CustomerFavService } from './customer-fav.service';

// Routes for customer fav Api's
@Controller()
export class CustomerFavController {
  constructor(private readonly customerFavService: CustomerFavService) {}

  // create route for customer fav
  @MessagePattern('topic-customer-fav-createFav')
  async createCustomerFav(@Payload() data) {
    const result = await this.customerFavService.createCustomerFav(
      data.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S4001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for all customer fav
  @MessagePattern('topic-customer-fav-findAllFav')
  async findAllCustomerFav(@Payload() data) {
    const result = await this.customerFavService.findAllCustomerFav(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S4002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search one by customer fav id route for customer fav
  @MessagePattern('topic-customer-fav-findOneFav')
  async findOneCustomerFav(@Payload() data) {
    const result = await this.customerFavService.findOneCustomerFav(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S4003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by customer id route for customer fav
  @MessagePattern('topic-customer-fav-findOneCustomerAllFav')
  async findOneCustomerAllCustomerFav(@Payload() data) {
    const result = await this.customerFavService.findOneCustomerAllCustomerFav(
      data.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S4002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete route for customer fav
  @MessagePattern('topic-customer-fav-deleteFav')
  async deleteCustomerFav(@Payload() data) {
    const result = await this.customerFavService.deleteCustomerFav(
      data.param.id,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S4004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
