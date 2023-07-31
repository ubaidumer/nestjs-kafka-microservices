import { Test, TestingModule } from '@nestjs/testing';
import { CustomerAffairService } from './customer-affair.service';

describe('CustomerAffairService', () => {
  let service: CustomerAffairService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerAffairService],
    }).compile();

    service = module.get<CustomerAffairService>(CustomerAffairService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
