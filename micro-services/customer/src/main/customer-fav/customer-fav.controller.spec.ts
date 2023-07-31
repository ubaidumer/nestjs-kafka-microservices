import { Test, TestingModule } from '@nestjs/testing';
import { CustomerFavController } from './customer-fav.controller';

describe('CustomerFavController', () => {
  let controller: CustomerFavController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerFavController],
    }).compile();

    controller = module.get<CustomerFavController>(CustomerFavController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
