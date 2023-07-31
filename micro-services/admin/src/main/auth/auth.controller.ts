import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { AuthService } from './auth.service';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';
import { take } from 'rxjs';

// Routes for auth Api's
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sagaKafkaClient: kafkaClientManager,
  ) {}

  // authenticate admin by google signup/login route
  @MessagePattern('topic-admin-auth-adminGoogleRegisteration')
  async adminGoogleRegisteration(@Payload() data) {
    const result = await this.authService.googleLogin(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S0001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // authenticate admin by google signup/login route
  @MessagePattern('topic-admin-auth-getAdminDetail')
  async getAdminDetial(@Payload() data) {
    const result = await this.authService.getAdminDetail(data.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S0004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // authenticate admin by email,password login route
  @MessagePattern('topic-admin-auth-adminLogIn')
  async adminLogIn(@Payload() data) {
    const result = await this.authService.logIn(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S0002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // create a new Admin with a temporary password that he can change later
  @MessagePattern('topic-admin-auth-updateAdmin')
  async updateAdmin(@Payload() data) {
    const result = await this.authService.updateAdmin(data.id.id, data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S0006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // create a new Admin with a temporary password that he can change later
  @MessagePattern('topic-admin-auth-createAdmin')
  async createAdmin(@Payload() data) {
    const result = await this.authService.createAdmin(data.body);
    if (result.isSuccess) {
      const updateBranchesObserver = this.sagaKafkaClient.sagaClient.send(
        'saga-topic-admin-to-product-updateBranches',
        `${JSON.stringify({
          adminId: result.body.id,
          branchIds: data.body.branchIds,
        })}`,
      ); // args - topic, message
      new Promise<void>((resolve, reject) => {
        updateBranchesObserver.pipe(take(1)).subscribe((result: any) => {
          resolve();
        });
      });
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S0003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find all Admins with query params and filter searching
  @MessagePattern('topic-admin-auth-findAllAdmin')
  async findAllAdmin(@Payload() payload) {
    const result: any = await this.authService.findAllAdmin(payload.query);

    const { city, region } = payload.query;

    //inter microservices communication
    // let query = { ...(city && { city }), ...(region && { region }) };

    let data = result.body;

    const findAllBranchesObserver = this.sagaKafkaClient.sagaClient.send(
      'saga-topic-admin-to-product-findAllBranches',
      `${JSON.stringify({ data })}`,
    ); // args - topic, message

    const promise1 = new Promise<void>((resolve, reject) => {
      findAllBranchesObserver.pipe(take(1)).subscribe((result: any) => {
        resolve(result);
      });
    });

    result.body = await promise1.then((result) => {
      return result;
    });

    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'ADMIN_S0005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
