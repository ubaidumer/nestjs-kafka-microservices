import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerService } from '../customer/customer.service';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';
import { take } from 'rxjs';

// Routes for Auth Api's
@Controller()
export class AuthSagaController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly sagaKafkaClient: kafkaClientManager,
  ) {}

  // find customer to return nested orders
  @MessagePattern('saga-topic-order-to-customer-findCustomer')
  async findCustomer(@Payload() payload) {
    const data = await this.customerService.findCustomer(payload.data);

    const branchObserver = await this.sagaKafkaClient.sagaClient.send(
      'saga-topic-customer-to-branch-findBranch',
      `${JSON.stringify({ data })}`,
    ); // args - topic, message

    const promise1 = new Promise<void>((resolve, reject) => {
      branchObserver.pipe(take(1)).subscribe((result: any) => {
        resolve(result);
      });
    });

    const result = await promise1.then((result) => {
      return result;
    });
    return result;
  }

  // add total paid ammount into customer revenue
  @MessagePattern('saga-topic-order-to-customer-updateCustomer')
  async addCustomerRevenue(@Payload() payload) {
    return await this.customerService.addCustomerRevenue(payload.data);
  }

  // add total paid ammount into customer revenue
  @MessagePattern('saga-topic-order-to-customer-findCustomerStatus')
  async findCustomerStatus(@Payload() payload) {
    const data = await this.customerService.findCustomerStatus(payload.data);
    return { ...data };
  }

  // add total paid ammount into customer revenue
  @MessagePattern(
    'saga-topic-order-to-customer-updateCustomeralternatePhoneNumber',
  )
  async updateCustomeralternatePhoneNumber(@Payload() payload) {
    return await this.customerService.updateCustomeralternatePhoneNumber(
      payload,
    );
  }
}
