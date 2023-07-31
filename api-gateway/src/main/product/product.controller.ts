import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { Roles } from 'src/role.decorator';
import { AuthGuard } from 'src/auth.guard';
import { HttpExceptionFilter } from 'src/utils/exceptionFilter';
import DeviceDetector from 'node-device-detector';
import {
  productTopicArray,
  selectionEnum,
} from 'src/utils/constant/productConstant';
import { Kafka } from 'kafkajs';
import {
  DeleteMultipleProductsDTO,
  ProductDTO,
  ProductIdsDTO,
  ProductPaginationQueryDTO,
  ProductsByAddressDTO,
  UnPublishDTO,
  UpdateMultipleProductsDTO,
  UpdateProductDTO,
} from 'src/dto/product/product.dto';
import {
  BranchPaginationQueryDTO,
  BranchShiftTimingDTO,
  CreateBranchDTO,
  UpdateBranchDTO,
} from 'src/dto/product/branch.dto';
import { configService } from 'src/config/config';
import {
  CategoryPaginationQueryDTO,
  CategoryPriorityListDTO,
  CreateCategoryDTO,
  DeleteMultipleCategoriessDTO,
  UpadateCategoryDTO,
  UpdateMultipleCategoriessDTO,
} from 'src/dto/product/category.dto';
import {
  CreateMenuDTO,
  MenuPaginationQueryDTO,
  UpdateMenuDTO,
} from 'src/dto/product/menu.dto';
import {
  CreateVoucherDTO,
  UpdateVoucherDTO,
  VoucherPaginationQueryDTO,
} from 'src/dto/product/voucher.dto';
import { CreateAddressDTO } from 'src/dto/admin/adress.dto';
import {
  AddonsPaginationQueryDTO,
  CreateAddonsDTO,
  UpdateAddonsDTO,
} from 'src/dto/product/addons.dto';
import {
  BannerPaginationQueryDTO,
  BannerPriorityListDTO,
  CreateBannerDTO,
  DeleteMultipleBannersDTO,
  UpadateBannerDTO,
  UpdateMultipleBannersDTO,
} from 'src/dto/product/banner.dto';

// Routes for auth Api's
@Controller('products')
export class productController {
  constructor() {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: configService.getKafkaClientConfig('ProductClient'),
      consumer: {
        groupId: 'PRODUCT_CONSUMER', // Should be the same thing we give in consumer
        allowAutoTopicCreation: true,
      },
    },
  })
  client: ClientKafka;

  async kafkaAdminCreateTopic() {
    const kafka = new Kafka(
      configService.getKafkaClientConfig('ProductClient'),
    );
    var admin = kafka.admin();

    // create new topic
    await admin.createTopics({
      waitForLeaders: true,
      topics: productTopicArray,
    });
  }
  async onModuleInit() {
    // Need to subscribe to topic
    // so that we can get the response from kafka microservice
    await this.kafkaAdminCreateTopic();

    // Need to subscribe to topic
    // so that we can get the response from kafka microservice

    productTopicArray.forEach((element) => {
      this.client.subscribeToResponseOf(element.topic);
    });

    this.client.connect();
  }

  // Branch routes...
  // create route for branch
  @UseGuards(AuthGuard)
  @Post('/branch')
  @Roles('SuperAdmin', 'Admin', 'BranchManagement')
  @UseFilters(new HttpExceptionFilter())
  createBranch(@Body() body: CreateBranchDTO) {
    return this.client.send(
      'topic-product-branch-createBranch',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // find all route for branch
  @UseGuards(AuthGuard)
  @Get('/branch')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest', 'BranchManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllBranches(@Req() req, @Query() query: BranchPaginationQueryDTO) {
    const { id, role } = req.user;
    return this.client.send(
      'topic-product-branch-findAllBranchs',
      `${JSON.stringify({ id, role, query })}`,
    ); // args - topic, message
  }

  // find single branch route by branch id
  @UseGuards(AuthGuard)
  @Get('/branch/find/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest', 'BranchManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneBranch(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-branch-findOneBranch',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // update branch by branch id route
  @UseGuards(AuthGuard)
  @Patch('/branch/update/:id')
  @Roles('SuperAdmin', 'Admin', 'BranchManagement')
  @UseFilters(new HttpExceptionFilter())
  updateBranch(@Param() param: { id: string }, @Body() body: UpdateBranchDTO) {
    return this.client.send(
      'topic-product-branch-updateBranch',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // update branch by branch id route
  @UseGuards(AuthGuard)
  @Patch('/branch/updateBranchTiming/:id')
  @Roles('SuperAdmin', 'Admin', 'BranchTimingManagement')
  @UseFilters(new HttpExceptionFilter())
  updateBranchTiming(
    @Param() param: { id: string },
    @Body() body: BranchShiftTimingDTO,
  ) {
    return this.client.send(
      'topic-product-branch-updateBranchTiming',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // delete branch by branch id route
  @UseGuards(AuthGuard)
  @Delete('/branch/delete/:id')
  @Roles('SuperAdmin', 'Admin', 'BranchManagement')
  @UseFilters(new HttpExceptionFilter())
  deleteBranch(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-branch-deleteBranch',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find single category by category id route for category
  @UseGuards(AuthGuard)
  @Post('/category/find/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findOneCategory(
    @Param() param: { id: string },
    @Body() body: { branchId: string },
  ) {
    return this.client.send(
      'topic-product-category-findOneCategory',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // Category routes...
  // create route for category
  @UseGuards(AuthGuard)
  @Post('/category')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  createCategory(@Body() body: CreateCategoryDTO) {
    return this.client.send(
      'topic-product-category-createCategory',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // find all route for category
  @UseGuards(AuthGuard)
  @Get('/category')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findAllCategories(@Query() query: CategoryPaginationQueryDTO) {
    return this.client.send(
      'topic-product-category-findAllCategorys',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // update catgory by category id route for category
  @UseGuards(AuthGuard)
  @Patch('/category/update/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateCategory(
    @Param() param: { id: string },
    @Body() body: UpadateCategoryDTO,
  ) {
    return this.client.send(
      'topic-product-category-updateCategory',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // publish and un_publish multiple categories by category ids route for category
  @UseGuards(AuthGuard)
  @Patch('/category/updateMultipleCategories')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateMultipleCategories(@Body() body: UpdateMultipleCategoriessDTO) {
    return this.client.send(
      'topic-product-category-updateMultipleCategories',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // delete category by category id route for customer
  @UseGuards(AuthGuard)
  @Delete('/category/delete/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  deleteCategory(@Param() param: { id: string }) {
    return this.client.send(
      'topic-order-category-deleteCategory',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // delete category by category id route for customer
  @UseGuards(AuthGuard)
  @Post('/category/deleteMultiple')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  deleteMultipleCategories(@Body() body: DeleteMultipleCategoriessDTO) {
    return this.client.send(
      'topic-product-category-deleteMultipleCategories',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // delete category by category id route for customer
  @UseGuards(AuthGuard)
  @Post('/category/removeProductFromCategory/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  removeProductFromCategory(
    @Param() param: { id: string },
    @Body() body: { productId: string },
  ) {
    return this.client.send(
      'topic-product-category-removeProductFromCategory',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // Menus routes...
  // create route for menu
  @UseGuards(AuthGuard)
  @Post('/menu')
  @Roles('SuperAdmin', 'Admin', 'MenuManagement')
  @UseFilters(new HttpExceptionFilter())
  createMenu(@Body() body: CreateMenuDTO) {
    return this.client.send(
      'topic-product-menu-createMenu',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // find all menus route for menu
  @UseGuards(AuthGuard)
  @Get('/menu')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest', 'MenuManagement')
  @UseFilters(new HttpExceptionFilter())
  findAllMenus(@Query() query: MenuPaginationQueryDTO) {
    return this.client.send(
      'topic-product-menu-findAllMenus',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find one menu by menu id route
  @UseGuards(AuthGuard)
  @Get('/menu/find/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest', 'MenuManagement')
  @UseFilters(new HttpExceptionFilter())
  findOneMenu(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-menu-findOneMenu',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // update menu by menu id route
  @UseGuards(AuthGuard)
  @Patch('/menu/update/:id')
  @Roles('SuperAdmin', 'Admin', 'MenuManagement')
  @UseFilters(new HttpExceptionFilter())
  updateMenu(@Param() param: { id: string }, @Body() body: UpdateMenuDTO) {
    return this.client.send(
      'topic-product-menu-updateMenu',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // delete menu by menu id route
  @UseGuards(AuthGuard)
  @Delete('/menu/delete/:id')
  @Roles('SuperAdmin', 'Admin', 'MenuManagement')
  @UseFilters(new HttpExceptionFilter())
  deleteMenu(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-menu-deleteMenu',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // Addons routes...
  // create route for Addons
  @UseGuards(AuthGuard)
  @Post('/addons')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  createAddons(@Body() body: CreateAddonsDTO) {
    return this.client.send(
      'topic-product-addons-createAddons',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // find all Addons route for menu
  @UseGuards(AuthGuard)
  @Get('/addons')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findAllAddons(@Query() query: AddonsPaginationQueryDTO) {
    return this.client.send(
      'topic-product-addons-findAllAddons',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find all Addons route for menu
  @UseGuards(AuthGuard)
  @Get('/addons/types')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findAllAddonsTpyes() {
    return this.client.send(
      'topic-product-addons-findAllAddonsTypes',
      `No data`,
    ); // args - topic, message
  }

  // find all Addons route for menu
  @UseGuards(AuthGuard)
  @Get('/addons/Bytypes')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findAllAddonsByTpyes() {
    return this.client.send(
      'topic-product-addons-findAllAddonsByTpyes',
      `No data`,
    ); // args - topic, message
  }

  // find one Addons by menu id route
  @UseGuards(AuthGuard)
  @Get('/addons/find/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findOneAddons(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-addons-findOneAddons',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // update menu by Addons id route
  @UseGuards(AuthGuard)
  @Patch('/addons/update/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateAddons(@Param() param: { id: string }, @Body() body: UpdateAddonsDTO) {
    return this.client.send(
      'topic-product-addons-updateAddons',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // delete menu by Addons id route
  @UseGuards(AuthGuard)
  @Delete('/addons/delete/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  deleteAddons(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-addons-deleteAddons',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // Voucher routes...
  // create route for voucher
  @UseGuards(AuthGuard)
  @Post('/voucher')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  createVoucher(@Req() req, @Body() body: CreateVoucherDTO) {
    const { id } = req.user;
    return this.client.send(
      'topic-product-voucher-createVoucher',
      `${JSON.stringify({ id, body })}`,
    ); // args - topic, message
  }

  // apply for voucher by a customer
  @UseGuards(AuthGuard)
  @Get('/voucher/applyForVoucherByCustomer/:id')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  applyForVoucherByCustomer(@Req() req, @Param() param: { id: string }) {
    const { id } = req.user;
    return this.client.send(
      'topic-product-voucher-applyForVoucherByCustomer',
      `${JSON.stringify({ param, id })}`,
    ); // args - topic, message
  }

  // customer request to use a voucher
  @UseGuards(AuthGuard)
  @Get('/voucher/useVoucherByCustomer/:id')
  @Roles('Customer')
  @UseFilters(new HttpExceptionFilter())
  useVoucherByCustomer(@Req() req, @Param() param: { id: string }) {
    const { id } = req.user;
    return this.client.send(
      'topic-product-voucher-useVoucherByCustomer',
      `${JSON.stringify({ param, id })}`,
    ); // args - topic, message
  }

  // find all route for voucher
  @UseGuards(AuthGuard)
  @Get('/voucher')
  @Roles('SuperAdmin', 'Admin', 'Customer')
  @UseFilters(new HttpExceptionFilter())
  findAllVouchers(@Query() query: VoucherPaginationQueryDTO) {
    return this.client.send(
      'topic-product-voucher-findAllVouchers',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find one voucher by voucher id route
  @UseGuards(AuthGuard)
  @Get('/voucher/find/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findOneVoucher(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-voucher-findOneVoucher',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find one customer all vouchers by customer id route
  @UseGuards(AuthGuard)
  @Get('/voucher/findByCustomer/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findAllVouchersByCustomerId(
    @Param() param: { id: string },
    @Query() query: VoucherPaginationQueryDTO,
  ) {
    return this.client.send(
      'topic-product-voucher-findAllVouchersByCustomerId',
      `${JSON.stringify({ param, query })}`,
    ); // args - topic, message
  }

  // update voucher by voucher id route for voucher
  @UseGuards(AuthGuard)
  @Patch('/voucher/update/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateVoucher(
    @Param() param: { id: string },
    @Body() body: UpdateVoucherDTO,
  ) {
    return this.client.send(
      'topic-product-voucher-updateVoucher',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // delete voucher by voucher id route for voucher
  @UseGuards(AuthGuard)
  @Delete('/voucher/delete/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  deleteVoucher(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-voucher-deleteVoucher',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // Product routes...
  // create route for product
  @UseGuards(AuthGuard)
  @Post('')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  createProduct(@Body() body: ProductDTO) {
    return this.client.send(
      'topic-product-createProduct',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // find all route for products
  @UseGuards(AuthGuard)
  @Get('/getAllProducts')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findAllProducts(@Query() query: ProductPaginationQueryDTO) {
    return this.client.send(
      'topic-product-findAllProducts',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // search all product by name and sort by price route
  @UseGuards(AuthGuard)
  @Get('/findAllProducts')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findAllProduct(@Query() query: ProductPaginationQueryDTO) {
    return this.client.send(
      'topic-product-getAllProducts',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // search all product by name and sort by price route
  @UseGuards(AuthGuard)
  @Post('/findAllProductsByCoordinates')
  @Roles('Customer', 'Guest', 'SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findAllProductByCoordinates(@Body() body: ProductsByAddressDTO) {
    return this.client.send(
      'topic-product-findAllProductsByCoordinates',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // search all product by name and sort by price route
  @UseGuards(AuthGuard)
  @Post('/findMenuBylocation')
  @Roles('Customer', 'Guest', 'SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findMenuBylocation(@Body() body: ProductsByAddressDTO) {
    return this.client.send(
      'topic-product-findMenuBylocation',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // find multiple products by ids array route for products
  @UseGuards(AuthGuard)
  @Post('/getMultipleProductsByIds')
  @Roles('Customer', 'SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  findMultipleProductsByIds(@Body() body: ProductIdsDTO) {
    return this.client.send(
      'topic-product-findMultipleProductsByIds',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // search by product id route for product
  @UseGuards(AuthGuard)
  @Get('/find/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findOneProduct(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-findOneProduct',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // find product by product name route for product
  @UseGuards(AuthGuard)
  @Get('/findProductByName')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findProductByName(@Query() query: selectionEnum) {
    return this.client.send(
      'topic-product-findProductByName',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find products by delection enum route for product
  @UseGuards(AuthGuard)
  @Get('/searchByselectionParams')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findProductBySelectionEnum(@Query() query: ProductPaginationQueryDTO) {
    return this.client.send(
      'topic-product-searchByselectionParams',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find all products by category id route for personalizes
  @UseGuards(AuthGuard)
  @Get('/byCategory/find/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findAllProductByCategory(
    @Param() param: { id: string },
    @Query() query: ProductPaginationQueryDTO,
  ) {
    return this.client.send(
      'topic-product-searchByCategory',
      `${JSON.stringify({ param, query })}`,
    ); // args - topic, message
  }

  // update product by product id route for product
  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateProduct(
    @Param() param: { id: string },
    @Body() body: UpdateProductDTO,
  ) {
    return this.client.send(
      'topic-product-updateProduct',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // update multiple products by product ids array route for product
  @UseGuards(AuthGuard)
  @Patch('/updateMultiple')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateMultipleProducts(@Body() body: UpdateMultipleProductsDTO) {
    return this.client.send(
      'topic-product-updateMultipleProducts',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // delete by product id route for product
  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  deleteProduct(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-deleteProduct',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // delete multiple products by product ids array route for product
  @UseGuards(AuthGuard)
  @Post('/deleteMultiple')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  deleteMutipleProducts(@Body() body: DeleteMultipleProductsDTO) {
    return this.client.send(
      'topic-product-deleteMultipleProducts',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // un-publish product for some time
  @UseGuards(AuthGuard)
  @Patch('/autoPublishTime/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  productAutoPublishTime(
    @Param() param: { id: string },
    @Body() body: UnPublishDTO,
  ) {
    return this.client.send(
      'topic-product-autoPublishTime',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // un-publish product for some time
  @UseGuards(AuthGuard)
  @Patch('/category/autoPublishTime/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  categoryAutoPublishTime(
    @Param() param: { id: string },
    @Body() body: UnPublishDTO,
  ) {
    return this.client.send(
      'topic-product-category-autoPublishTime',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // update all changed categories by new priority field values
  @UseGuards(AuthGuard)
  @Patch('/category/updatepriority')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateCategoryPriority(@Body() body: CategoryPriorityListDTO) {
    return this.client.send(
      'topic-product-category-updateCategoryPriority',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // create route for banner
  @UseGuards(AuthGuard)
  @Post('/banner')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  createBanner(@Body() body: CreateBannerDTO) {
    return this.client.send(
      'topic-product-banner-createBanner',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // find all route for banner
  @UseGuards(AuthGuard)
  @Get('/banner')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findAllBanner(@Query() query: BannerPaginationQueryDTO) {
    return this.client.send(
      'topic-product-banner-findAllBanners',
      `${JSON.stringify({ query })}`,
    ); // args - topic, message
  }

  // find single banner by banner id route for banner
  @UseGuards(AuthGuard)
  @Get('/banner/find/:id')
  @Roles('Customer', 'SuperAdmin', 'Admin', 'Guest')
  @UseFilters(new HttpExceptionFilter())
  findOneBanner(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-banner-findOneBanner',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // update banner by banner id route for banner
  @UseGuards(AuthGuard)
  @Patch('/banner/update/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateBanner(@Param() param: { id: string }, @Body() body: UpadateBannerDTO) {
    return this.client.send(
      'topic-product-banner-updateBanner',
      `${JSON.stringify({ param, body })}`,
    ); // args - topic, message
  }

  // publish and un_publish multiple Banners by banner ids route for banner
  @UseGuards(AuthGuard)
  @Patch('/banner/updateMultipleBanners')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateMultipleBanners(@Body() body: UpdateMultipleBannersDTO) {
    return this.client.send(
      'topic-product-banner-updateMultipleBanners',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // delete banner by banner id route for customer
  @UseGuards(AuthGuard)
  @Delete('/banner/delete/:id')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  deleteBanner(@Param() param: { id: string }) {
    return this.client.send(
      'topic-product-banner-deleteBanner',
      `${JSON.stringify({ param })}`,
    ); // args - topic, message
  }

  // delete banner by banner id route for customer
  @UseGuards(AuthGuard)
  @Post('/banner/deleteMultiple')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  deleteMultipleBanners(@Body() body: DeleteMultipleBannersDTO) {
    return this.client.send(
      'topic-product-banner-deleteMultipleBanners',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // update all changed banner by new priority field values
  @UseGuards(AuthGuard)
  @Patch('/banner/updatepriority')
  @Roles('SuperAdmin', 'Admin')
  @UseFilters(new HttpExceptionFilter())
  updateBannerPriority(@Body() body: BannerPriorityListDTO) {
    return this.client.send(
      'topic-product-banner-updateBannerPriority',
      `${JSON.stringify({ body })}`,
    ); // args - topic, message
  }

  // util functions

  // device dectector function for OS,Client and device information
  requestInfo(req, type) {
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });
    const userAgent = req.headers['user-agent'];
    const result = detector.detect(userAgent);

    let body = {};
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    body['ipAddress'] = ip;
    body['customerType'] = type;
    body['osInfo'] = result.os;
    body['deviceInfo'] = result.device;
    body['clientInfo'] = result.client;
    return body;
  }
}
