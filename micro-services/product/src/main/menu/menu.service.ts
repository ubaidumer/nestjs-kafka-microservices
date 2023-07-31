import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { MenuRepository } from './menu.repository';

// Services to perform all bussiness and required operations
@Injectable()
export class MenuService {
  constructor(private readonly menuRepository: MenuRepository) {}

  // create query and exception handling
  async create(body) {
    try {
      const data = await this.menuRepository.create(body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by menu id query and exception handling
  async findById(id) {
    try {
      await this.validateId(id);
      const data = await this.menuRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all menus and exception handling
  async getAllMenus(query) {
    try {
      const data = await this.menuRepository.getAllMenus(query);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by menu id query and exception handling
  async updateMenuById(id: string, body) {
    try {
      await this.validateId(id);
      const data = await this.menuRepository.updateMenuById(id, { ...body });
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by menu id query and exception handling
  async deleteMenuById(id: string) {
    try {
      await this.validateId(id);
      const data = await this.menuRepository.deleteMenuById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates menu id
  async validateId(id) {
    const checkId = await this.menuRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('PRODUCT_E0007');
    }
    return;
  }
}
