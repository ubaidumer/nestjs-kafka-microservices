import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  // Bussiness functions

  // search customer service function
  async findAllCustomer(query) {
    try {
      const { page = 0, limit = 10, sort = 'desc', status, name } = query;
      const data = await this.customerRepository.find({
        skip: page * limit,
        take: limit,
        sort,
        status,
        name,
      });
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by customer id service function
  async findOneCustomer(id) {
    try {
      await this.validateId(id);
      const data = await this.customerRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by customer id service function
  async findOneCustomerByPhone(phoneNo) {
    try {
      const data = await this.customerRepository.findByPhoneNo(phoneNo);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by customer id service function
  async updateCustomer(id, body) {
    try {
      const { email } = body;
      await this.validateId(id);
      if (email) {
        await this.validateEmail(email);
      }
      const data = await this.customerRepository.update(id, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by customer id service function
  async updateCustomerStatus(id, body) {
    try {
      await this.validateId(id);
      const data = await this.customerRepository.update(id, body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  //util functions

  // validates customer id
  async validateId(id) {
    const checkId = await this.customerRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('CUSTOMER_E0005');
    }
    return;
  }

  // validates customer phone No
  async validatephoneNo(phoneNo) {
    const checkPhoneNo = await this.customerRepository.findByPhoneNo(phoneNo);
    if (phoneNo !== null && checkPhoneNo) {
      throw new BadRequestException('CUSTOMER_E0002');
    }
    return;
  }

  // validates customer email
  async validateEmail(email) {
    const checkEmail = await this.customerRepository.findByEmail(email);
    if (email !== null && checkEmail) {
      throw new BadRequestException('CUSTOMER_E0001');
    }
    return;
  }
  // saga utils

  // saga query method of repository for nested object initialization
  async findCustomer(data) {
    const customerData = await this.customerRepository.findCustomer(
      data.customerId,
    );

    data.customerName = customerData ? customerData?.fullName : '';
    data.customerEmail = customerData ? customerData?.email : '';
    data.customerPhoneNo = customerData ? customerData?.phoneNo : '';
    data.customerDob = customerData ? customerData?.dob : '';
    return data;
  }

  // saga query method of repository for nested object initialization
  async addCustomerRevenue(data) {
    const { customerId, total } = data;
    const checkId = await this.customerRepository.findById(customerId);
    if (!checkId) return;
    return await this.customerRepository.addCustomerRevenue(customerId, total);
  }

  // saga query method of repository for nested object initialization
  async updateCustomeralternatePhoneNumber(data) {
    const checkId = await this.customerRepository.findById(data.id);
    if (!checkId) return;
    return await this.customerRepository.updateCustomeralternatePhoneNumber(
      data.id,
      data.alternatePhoneNo,
    );
  }

  // check customer status is blocked or not
  async findCustomerStatus(id) {
    return await this.customerRepository.findById(id);
  }
}
