import { Test, TestingModule } from '@nestjs/testing';
import { FinancialAssistanceService } from './financial-assistance.service';

describe('FinancialAssistanceService', () => {
  let service: FinancialAssistanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialAssistanceService],
    }).compile();

    service = module.get<FinancialAssistanceService>(FinancialAssistanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
