import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAffairController } from './customer-affair.controller';

describe('CustomerAffairController', () => {
  let controller: CustomerAffairController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerAffairController],
    }).compile();

    controller = module.get<CustomerAffairController>(CustomerAffairController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
