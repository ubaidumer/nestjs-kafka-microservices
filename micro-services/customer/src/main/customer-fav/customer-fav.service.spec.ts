import { Test, TestingModule } from '@nestjs/testing';
import { CustomerFavService } from './customer-fav.service';

describe('CustomerFavService', () => {
  let service: CustomerFavService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerFavService],
    }).compile();

    service = module.get<CustomerFavService>(CustomerFavService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
