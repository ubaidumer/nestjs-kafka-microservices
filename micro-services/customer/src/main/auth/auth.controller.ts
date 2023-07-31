import { Controller, Query } from '@nestjs/common';
import { formatResponse } from 'src/utils/response';
import { AuthService } from './auth.service';
import { CustomerService } from '../customer/customer.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

// Routes for auth Api's
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly customerService: CustomerService,
  ) {}

  // authenticate guest user by skipping signup/login route
  @MessagePattern('topic-customer-auth-guestRegisteration')
  async guestRegisteration(@Payload() data) {
    const result = await this.authService.guestRegisteration(data.request);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, 'CUSTOMER_E0015');
    }
  }

  // signup route for guest type customer
  @MessagePattern('topic-customer-auth-guestOnboarding')
  async guestOnboarding(@Payload() data) {
    const result = await this.authService.guestOnboarding(data.id, data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // signup route for authorized type customer
  @MessagePattern('topic-customer-auth-userOnboarding')
  async userOnboarding(@Payload() data) {
    const result = await this.authService.customerOnboarding(
      data.request,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // signup route for authorized type customer by admin
  @MessagePattern('topic-customer-auth-userOnboardingByAdmin')
  async userOnboardingByAdmin(@Payload() data) {
    const result = await this.authService.userOnboardingByAdmin(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // send otp phone number route for customer
  @MessagePattern('topic-customer-auth-sendOtp')
  async sendOtp(@Payload() data) {
    const result = await this.authService.sendOtp(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // verify otp phone number route for customer
  @MessagePattern('topic-customer-auth-verifyOtp')
  async verifyOtp(@Payload() data) {
    const result = await this.authService.verifyOtp(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S1004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for customer
  @MessagePattern('topic-customer-auth-findAllCustomer')
  async findAllCustomer(@Payload() data) {
    const result = await this.customerService.findAllCustomer(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S2001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by customer id route for customer
  @MessagePattern('topic-customer-auth-findOneCustomer')
  async findOneCustomer(@Payload() data) {
    const result = await this.customerService.findOneCustomer(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S2002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search by customer phoneNo route for customer
  @MessagePattern('topic-customer-auth-findOneCustomerByPhone')
  async findOneCustomerByPhone(@Payload() data) {
    const result = await this.customerService.findOneCustomerByPhone(
      data.param.phoneNo,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S2002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update by customer id route for customer
  @MessagePattern('topic-customer-auth-updateCustomer')
  async updateCustomer(@Payload() data) {
    const result = await this.customerService.updateCustomer(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S2003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update by customer id route for customer
  @MessagePattern('topic-customer-auth-updateCustomerStatus')
  async updateCustomerStatus(@Payload() data) {
    const result = await this.customerService.updateCustomerStatus(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'CUSTOMER_S2003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
