import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { AwsService } from 'src/utils/aws.service';
import { CategoryRepository } from '../category/category.repository';
import { BranchRepository } from '../branch/branch.repository';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';

// Services to perform all bussiness and required operations
@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepo: CategoryRepository,
    private readonly branchRepo: BranchRepository,
    private readonly awsService: AwsService,
  ) {}

  // create query and exception handling
  async create(body) {
    try {
      const { originalName, mimeType } = body.image;
      const dupProduct = await this.validateName(body.name);
      if (dupProduct) {
        throw new BadRequestException('PRODUCT_E0001');
      }
      const fileResponse = await this.awsService.getUploadUrl(
        `products/${Date.now()}-${originalName}`,
        mimeType,
      );
      body.image = fileResponse.key;
      const data = await this.productRepository.create(body);
      await this.categoryRepo.addProductInCategory(body.categoryId, data.id);
      data.image = fileResponse.url;
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by product id query and exception handling
  async findById(id) {
    try {
      await this.validateId(id);
      const data = await this.productRepository.findById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by product ids array query and exception handling
  async findMultipleProductsByIds(ids) {
    try {
      for (const id of ids) {
        await this.validateId(id);
      }
      const data = await this.productRepository.findMultipleProductsByIds(ids);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // get all products by selection enum , isDeal and exception handling
  async findAllProductsBySelectionEnum(query) {
    try {
      const data = await this.productRepository.findAllProductsBySelectionEnum(
        query,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // find all products with query params and exception handling
  async findAllProductsName(body) {
    try {
      const data = await this.productRepository.findAllProductsName(body);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by product selectionEnum value query and exception handling
  async findProductBySelectionEnum(query) {
    try {
      const data = await this.productRepository.findProductBySelectionEnum(
        query,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search products by category id query and exception handling
  async findProductByCategory(categoryId, query) {
    try {
      const category = await this.categoryRepo.findOne(categoryId, query);
      const products = await this.productRepository.getProductByIds(
        category.paginatedProductIds,
      );
      return {
        body: { products, totalCount: category.totalCount },
        isSuccess: true,
      };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by product name query and exception handling
  async getProductByName(search) {
    try {
      const data = await this.productRepository.getProductByName(search);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by product name query and exception handling
  async findAllProductsByCoordinates(data) {
    try {
      const branch = await this.branchRepo.findBranchByCoordinates(
        data.lat,
        data.long,
      );
      if (!branch) {
        throw new BadRequestException('PRODUCT_E0015');
      }
      const productRecoreds =
        await this.productRepository.findAllProductsByCoordinates(branch._id);

      return {
        body: { productRecoreds, branchId: branch._id },
        isSuccess: true,
      };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // search by product name query and exception handling
  async findMenuBylocation(data) {
    try {
      const branch = await this.branchRepo.findBranchByCoordinates(
        data.lat,
        data.long,
      );
      if (!branch) {
        throw new BadRequestException('PRODUCT_E0015');
      }
      const productRecoreds =
        await this.categoryRepo.findCategoryByProductBranch(branch._id);

      return {
        body: { productRecoreds, branchId: branch._id },
        isSuccess: true,
      };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update by products id query and exception handling
  async updateProductById(id: string, body) {
    try {
      await this.validateId(id);
      let imageURL;
      if (body.name) {
        const dupProduct = await this.validateName(body.name);
        if (dupProduct) {
          throw new BadRequestException('PRODUCT_E0001');
        }
      }
      let product = await this.productRepository.findById(id);
      if (body.image) {
        const { originalName, mimeType } = body.image;
        this.awsService.deleteFile(product.image);
        const fileResponse = await this.awsService.getUploadUrl(
          `products/${Date.now()}-${originalName}`,
          mimeType,
        );
        body.image = fileResponse.key;
        imageURL = fileResponse.url;
      }
      if (body.categoryId) {
        await this.categoryRepo.updateProductInCategory(body.categoryId, id);
      }
      await this.productRepository.updateProductById(id, {
        ...body,
      });

      return { body: { image: imageURL }, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // update Multiple products by product ids query and exception handling
  async updateMultipleProducts(
    ids: string[],
    isAvailable: boolean,
    categoryId: string,
  ) {
    try {
      for (const id of ids) {
        await this.validateId(id);
      }
      const data = await this.productRepository.updateMultipleProductsByIds(
        ids,
        isAvailable,
        categoryId,
      );
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by products id query and exception handling
  async deleteProductById(id: string) {
    try {
      await this.validateId(id);
      const data = await this.productRepository.deleteProductById(id);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // delete by product ids query and exception handling
  async deleteMutipleProducts(ids: string[]) {
    try {
      for (const id of ids) {
        await this.validateId(id);
      }
      const data = await this.productRepository.deleteProductsByIds(ids);
      return { body: data, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // unpublish product for some time
  async productAutoPublishTime(id, data) {
    try {
      await this.validateId(id);
      const result = await this.productRepository.productAutoPublishTime(
        id,
        data.autoPublishTime,
      );
      return { body: result, isSuccess: true };
    } catch (err) {
      return {
        code: err.status,
        message: err.message,
        isSuccess: false,
      };
    }
  }

  // validates product id
  async validateId(id) {
    const checkId = await this.productRepository.findById(id);
    if (id !== null && !checkId) {
      throw new BadRequestException('PRODUCT_E0007');
    }
    return;
  }
  // validates Rider email for sign up / login
  async validateName(name) {
    const checkName = await this.productRepository.findByName(name);
    if (name && checkName) {
      return true;
    } else {
      return false;
    }
  }

  // saga utils

  // saga query method of repository for nested object initialization
  async addRevenueInProducts(data) {
    // Summing up the "subTotal" property
    for (let i = 0; i < data.orderItems.length; i++) {
      if (!data.orderItems[i].productOptions) {
        data.subTotal =
          data.subTotal +
          data.orderItems[i].productBasePrice *
            data.orderItems[i].productQuantity;
        await this.productRepository.addrevenueInProduct({
          id: data.orderItems[i].productId,
          revenue:
            data.orderItems[i].productBasePrice *
            data.orderItems[i].productQuantity,
        });
      } else {
        let orderItemsTotal = 0;
        for (let j = 0; j < data.orderItems[i].productOptions.length; j++) {
          orderItemsTotal =
            (data.orderItems[i].productQuantity
              ? data.orderItems[i].productQuantity
              : 1) *
            data.orderItems[i].productOptions[j].variations.reduce(
              (accumulator, currentValue) =>
                currentValue.price *
                  (currentValue.quantity ? currentValue.quantity : 1) +
                accumulator,
              0,
            );
          data.subTotal = orderItemsTotal + data.subTotal;
        }
        await this.productRepository.addrevenueInProduct({
          id: data.orderItems[i].productId,
          revenue: orderItemsTotal,
        });
      }
    }

    return;
  }

  // cron jobs

  @Cron('*/60 * * * * *')
  async productAutoPublishCronJob() {
    const result = await this.productRepository.getAllProduct();
    const newDate = moment.utc(new Date().toISOString()).subtract(60, 's');
    const currentTime = newDate.add(5, 'hours');
    let ids = [];
    for (let i = 0; i < result.length; i++) {
      if (result[i].autoPublishTime) {
        const momentDate = moment.utc(result[i].autoPublishTime.toISOString());

        const checkTime = moment(momentDate).isSameOrBefore(currentTime);
        if (checkTime) {
          ids.push(result[i]._id);
        }
        await this.productRepository.productAutoPublishCronJob(ids);
      }
    }
  }
}
