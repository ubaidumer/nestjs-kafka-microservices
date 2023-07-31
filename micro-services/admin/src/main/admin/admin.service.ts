import { BadRequestException, Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class AdminService {
  constructor(private readonly adminRepository: AdminRepository) {}
  // Bussiness functions

  // create Admin service function
  async createAdmin(body) {
    const data = await this.adminRepository.create(body);
    return data;
  }

  // search Admin service function
  async findAllAdmin(query) {
    const {
      page = 0,
      limit = 10,
      status,
      branchId,
      sort = 'desc',
      fullName,
    } = query;
    const data = await this.adminRepository.find({
      skip: page * limit,
      take: limit,
      sort,
      branchId,
      status,
      fullName,
    });
    return data;
  }

  // search by Admin id service function
  async findOneAdmin(id) {
    await this.validateId(id);
    const data = await this.adminRepository.findById(id);
    return data;
  }

  // update by Admin id service function
  async updateAdmin(id, body) {
    const { email } = body;
    await this.validateId(id);
    await this.validateEmail(email);
    const data = await this.adminRepository.update(id, body);
    return data;
  }

  //util functions

  // validates Admin id
  async validateId(id) {
    const checkId = await this.adminRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('ADMIN_E0002');
    }
    return;
  }

  // validates Admin email for sign up / login
  async validateEmail(email) {
    const checkEmail = await this.adminRepository.findByEmail(email);
    if (email !== null && checkEmail) {
      return true;
    } else {
      return false;
    }
  }

  //saga utils functions

  // update by Admin id service function
  async addBranchToAdmin(branchId) {
    return await this.adminRepository.addBranchToAdmin(branchId);
  }
}
