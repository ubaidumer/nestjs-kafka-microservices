import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AdminService } from './admin.service';

// Routes for Auth Api's
@Controller()
export class AuthSagaController {
  constructor(private readonly adminService: AdminService) {}

  // add total paid ammount into customer revenue
  @MessagePattern('saga-topic-branch-to-admin-addBranchToAdmin')
  async addBranchToAdmin(@Payload() payload) {
    return await this.adminService.addBranchToAdmin(payload.branchId);
  }
}
