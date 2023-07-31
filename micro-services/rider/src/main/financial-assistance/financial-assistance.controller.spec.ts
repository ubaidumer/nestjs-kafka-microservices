import { Test, TestingModule } from '@nestjs/testing';
import { FinancialAssistanceController } from './financial-assistance.controller';

describe('FinancialAssistanceController', () => {
  let controller: FinancialAssistanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinancialAssistanceController],
    }).compile();

    controller = module.get<FinancialAssistanceController>(FinancialAssistanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
