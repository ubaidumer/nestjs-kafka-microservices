import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { take } from 'rxjs';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';

import { formatResponse } from 'src/utils/response';
import { BranchService } from './branch.service';
import { BranchRepository } from './branch.repository';

// Routes for Branch Api's
@Controller()
export class BranchController {
  constructor(
    private readonly branchService: BranchService,
    private readonly sagaKafkaClient: kafkaClientManager,
    private readonly branchRepo: BranchRepository,
  ) {}

  // create new branch route
  @MessagePattern('topic-product-branch-createBranch')
  async createBranch(@Payload() data) {
    const result = await this.branchService.create(data.body);

    if (result.isSuccess) {
      const branchId = result.body._id;
      const updateAdminObserver = await this.sagaKafkaClient.sagaClient.send(
        'saga-topic-branch-to-admin-addBranchToAdmin',
        `${JSON.stringify({
          branchId,
        })}`,
      ); // args - topic, message

      new Promise<void>((resolve, reject) => {
        updateAdminObserver.pipe(take(1)).subscribe((result: any) => {
          for (let i = 0; i < result.length; i++) {
            this.branchRepo.updateAdminIdsBranch(result[i], branchId);
          }
          resolve();
        });
      });
    }

    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S2001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all branches route
  @MessagePattern('topic-product-branch-findAllBranchs')
  async findAllBranch(@Payload() data) {
    const result = await this.branchService.getAllBranches(
      data.id,
      data.role,
      data.query,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S2002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find one branch using branch id route
  @MessagePattern('topic-product-branch-findOneBranch')
  async findOneBranch(@Payload() data) {
    const result = await this.branchService.findById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S2003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one branch using branch id route
  @MessagePattern('topic-product-branch-updateBranch')
  async updateBranch(@Payload() data) {
    const result = await this.branchService.updateBranchById(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S2004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update one branch using branch id route
  @MessagePattern('topic-product-branch-updateBranchTiming')
  async updateBranchTiming(@Payload() data) {
    const result = await this.branchService.updateBranchTiming(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S2004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
  // delete one branch using branch id route
  @MessagePattern('topic-product-branch-deleteBranch')
  async deleteBranch(@Payload() data) {
    const result = await this.branchService.deleteBranchById(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'PRODUCT_S2005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
