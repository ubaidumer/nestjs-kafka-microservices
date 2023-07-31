import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BranchService } from './branch.service';
import { BranchRepository } from './branch.repository';

// Routes for Branch Api's
@Controller()
export class BranchSagaController {
  constructor(
    private readonly branchService: BranchService,
    private readonly brancRepo: BranchRepository,
  ) {}

  // find all branches route
  @MessagePattern('saga-topic-admin-to-product-findAllBranches')
  async adminFindAllBranch(@Payload() payload) {
    return await this.branchService.adminFindUsingQuery(payload.data);
  }

  // find all branches route
  @MessagePattern('saga-topic-admin-to-product-adminFindAllBranchIds')
  async adminFindAllBranchIds() {
    return await this.branchService.adminFindAllBranchIds();
  }

  // find all branches route
  @MessagePattern('saga-topic-rider-to-product-findAllBranchesForGroupBy')
  async riderFindAllBranch(@Payload() payload) {
    const array = await payload.data.filter((rider) => {
      if (rider.branchid == null) {
        return false;
      } else {
        return true;
      }
    });
    return await this.branchService.riderFindUsingQuery(array);
  }

  // update branches route
  @MessagePattern('saga-topic-admin-to-product-updateBranches')
  async updateBranch(@Payload() payload) {
    return await this.brancRepo.updateAdminIdsBranch(
      payload.adminId,
      payload.branchIds,
    );
  }

  //      'saga-topic-admin-to-product-updateBranches',

  // // find one branches for customer-order nested object route
  // @MessagePattern('saga-topic-customer-to-branch-findBranch')
  // async customerFindBranch(@Payload() payload) {
  //   const data = payload.data;

  //   const branchData = (
  //     await this.branchService.findById(payload.data.branchId)
  //   ).body;
  //   console.log('mcvgjscm,', branchData);
  //   data.branchName = branchData ? branchData.name : '';
  //   data.branchCity = branchData ? branchData.city : '';
  //   data.branchRegion = branchData ? branchData.region : '';
  //   data.branchAddress = branchData ? branchData.address : '';
  //   return data;
  // }
}
