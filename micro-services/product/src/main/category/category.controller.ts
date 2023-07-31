import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { formatResponse } from 'src/utils/response';
import { CategoryService } from './category.service';

// Routes for Category Api's
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // create new category route
  @MessagePattern('topic-product-category-createCategory')
  async createCategory(@Payload() data) {
    const result = await this.categoryService.create(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all categories route
  @MessagePattern('topic-product-category-findAllCategorys')
  async findAllCategory(@Payload() data) {
    const result = await this.categoryService.getAllCategories(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one category using category id route
  @MessagePattern('topic-product-category-findOneCategory')
  async findOneCategory(@Payload() data) {
    const result = await this.categoryService.findById(
      data.param.id,
      data.body.branchId,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one category using category id route
  @MessagePattern('topic-product-category-updateCategory')
  async updateCategory(@Payload() data) {
    const result = await this.categoryService.updateCategoryById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update multiple categories using category ids route
  @MessagePattern('topic-product-category-updateMultipleCategories')
  async updateMultipleCategories(@Payload() data) {
    const { categoryIds, isAvailable } = data.body;
    const result = await this.categoryService.updateMultipleCategoryByIds(
      categoryIds,
      isAvailable,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete one category using category id route
  @MessagePattern('topic-order-category-deleteCategory')
  async deleteCategory(@Payload() data) {
    const result = await this.categoryService.deleteCategoryById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete multiple categories using categories ids route
  @MessagePattern('topic-product-category-deleteMultipleCategories')
  async deleteMutipleCategories(@Payload() data) {
    const { categoriesIds } = data.body;
    const result = await this.categoryService.deleteMutipleCategories(
      categoriesIds,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete multiple categories using categories ids route
  @MessagePattern('topic-product-category-removeProductFromCategory')
  async removeProductFromCategory(@Payload() data) {
    const result = await this.categoryService.removeProductFromCategory(
      data.param.id,
      data.body.productId,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3007',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // unPublish  product for specific time
  @MessagePattern('topic-product-category-autoPublishTime')
  async categoryAutoPublishTime(@Payload() data) {
    const result = await this.categoryService.categoryAutoPublishTime(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3008',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update all changed categories by new priority field values
  @MessagePattern('topic-product-category-updateCategoryPriority')
  async updateCategoryPriority(@Payload() data) {
    const result = await this.categoryService.updateCategoryPriority(
      data.body.categoryPriority,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S3009',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
