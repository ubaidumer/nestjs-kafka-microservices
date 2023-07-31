import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { ProductService } from './product.service';

// Routes for create product Api's
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // create product route
  @MessagePattern('topic-product-createProduct')
  async createProduct(@Payload() data) {
    const result = await this.productService.create(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all products by selection enum and isDeal route
  @MessagePattern('topic-product-findAllProducts')
  async findAllProductsBySelectionEnum(@Payload() data) {
    const result = await this.productService.findAllProductsBySelectionEnum(
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one product using product id route
  @MessagePattern('topic-product-findOneProduct')
  async findOneProduct(@Payload() data) {
    const result = await this.productService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one product using product id route
  @MessagePattern('topic-product-updateProduct')
  async updateProduct(@Payload() data) {
    const result = await this.productService.updateProductById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete one product using product id route
  @MessagePattern('topic-product-deleteProduct')
  async deleteProduct(@Payload() data) {
    const result = await this.productService.deleteProductById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search products by name route with http get method
  @MessagePattern('topic-product-findProductByName')
  async findProductByName(@Payload() data) {
    const result = await this.productService.getProductByName(
      data.query.search,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search all products by selection enum route with http get method
  @MessagePattern('topic-product-searchByselectionParams')
  async findProductBySelectionEnum(@Payload() data) {
    const result = await this.productService.findProductBySelectionEnum(
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1007',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search all products by category id route with http get method
  @MessagePattern('topic-product-searchByCategory')
  async findAllProductByCategory(@Payload() data) {
    const result = await this.productService.findProductByCategory(
      data.param.id,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1008',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find multiple products using product ids array route
  @MessagePattern('topic-product-findMultipleProductsByIds')
  async findMultipleProductsByIds(@Payload() data) {
    const result = await this.productService.findMultipleProductsByIds(
      data.body.productIds,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1009',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all products by elastic search route
  @MessagePattern('topic-product-getAllProducts')
  async findAllProductsName(@Payload() data) {
    const result = await this.productService.findAllProductsName(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1010',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // delete multiple products using product id route
  @MessagePattern('topic-product-deleteMultipleProducts')
  async deleteMutipleProducts(@Payload() data) {
    const { productIds } = data.body;
    const result = await this.productService.deleteMutipleProducts(productIds);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1011',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update multiple products using product ids route
  @MessagePattern('topic-product-updateMultipleProducts')
  async updateMultipleProducts(@Payload() data) {
    const { productIds, isAvailable, categoryId } = data.body;
    const result = await this.productService.updateMultipleProducts(
      productIds,
      isAvailable,
      categoryId,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1012',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all products by coordinates route
  @MessagePattern('topic-product-findAllProductsByCoordinates')
  async findAllProductsByCoordinates(@Payload() data) {
    const result = await this.productService.findAllProductsByCoordinates(
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1013',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all products by coordinates route
  @MessagePattern('topic-product-findMenuBylocation')
  async findMenuBylocation(@Payload() data) {
    const result = await this.productService.findMenuBylocation(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1014',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // unPublish  product for specific time
  @MessagePattern('topic-product-autoPublishTime')
  async productAutoPublishTime(@Payload() data) {
    const result = await this.productService.productAutoPublishTime(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S1015',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
