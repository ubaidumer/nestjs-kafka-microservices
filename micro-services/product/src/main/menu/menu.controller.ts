import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { MenuService } from './menu.service';

// Routes for Menus Api's
@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // create menu route
  @MessagePattern('topic-product-menu-createMenu')
  async createMenu(@Payload() data) {
    const result = await this.menuService.create(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S0001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all menus route
  @MessagePattern('topic-product-menu-findAllMenus')
  async findAllMenu(@Payload() data) {
    const result = await this.menuService.getAllMenus(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S4002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one menu using menu id route
  @MessagePattern('topic-product-menu-findOneMenu')
  async findOneMenu(@Payload() data) {
    const result = await this.menuService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S4003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one menu using menu id route
  @MessagePattern('topic-product-menu-updateMenu')
  async updateMenu(@Payload() data) {
    const result = await this.menuService.updateMenuById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S4004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete one menu using menu id route
  @MessagePattern('topic-product-menu-deleteMenu')
  async deleteMenu(@Payload() data) {
    const result = await this.menuService.deleteMenuById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S4005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
