import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { formatResponse } from 'src/utils/response';
import { RiderService } from '../rider/rider.service';
import { AuthService } from './auth.service';
import { kafkaClientManager } from 'src/utils/kafka.saga.client';
import { take } from 'rxjs';
import { TrainingService } from '../rider/training.services';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly riderService: RiderService,
    private readonly sagaKafkaClient: kafkaClientManager,
    private readonly trainingServices: TrainingService,
  ) {}

  // authenticate rider by email,password login route
  @MessagePattern('topic-rider-auth-riderLogin')
  async riderLogIn(@Payload() data) {
    const result = await this.authService.logIn(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0002',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // create a new rider with a temporary password that he can change later
  @MessagePattern('topic-rider-auth-createRider')
  async createrider(@Payload() data) {
    const result = await this.authService.createRider(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0001',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // verify otp cnic route for customer
  @MessagePattern('topic-rider-auth-verifyOtp')
  async verifyOtp(@Payload() data) {
    const result = await this.authService.verifyOtp(data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0003',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for rider
  @MessagePattern('topic-rider-auth-findAllRider')
  async findAllRider(@Payload() data) {
    const result = await this.riderService.findAllRider(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search route for rider and grouping them according to branchIds
  @MessagePattern('topic-rider-auth-findAllRiderGroupByBranch')
  async findAllRiderGroupByBranch() {
    const result: any = await this.riderService.findAllRiderGroupByBranch();

    //inter microservices communication

    let data = result.body;

    const findAllBranchesObserver = this.sagaKafkaClient.sagaClient.send(
      'saga-topic-rider-to-product-findAllBranchesForGroupBy',
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
        'RIDER_S0004',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // search one rider by rider id route for rider
  @MessagePattern('topic-rider-auth-findOneRider')
  async findOneRider(@Payload() data) {
    const result = await this.riderService.findOneRider(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
  // search by rider id route for rider
  @MessagePattern('topic-rider-auth-findOneRiderByRider')
  async findOneRiderByRider(@Payload() data) {
    const result = await this.riderService.findOneRider(data.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0005',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update by rider id route for rider
  @MessagePattern('topic-rider-auth-updateRider')
  async updateRider(@Payload() data) {
    const result = await this.riderService.updateRider(
      data.param.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  @MessagePattern('topic-rider-auth-updateRiderByRider')
  async updateRiderByRider(@Payload() data) {
    const result = await this.riderService.updateRiderByRider(
      data.id,
      data.body,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0006',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // upload training files of rider
  @MessagePattern('topic-rider-auth-uploadTraining')
  async uploadTraining(@Payload() data) {
    const result = await this.trainingServices.create(data.id, data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0008',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // upload training files of rider
  @MessagePattern('topic-rider-auth-unPublishTraing')
  async unPublishTraing(@Payload() data) {
    const result = await this.trainingServices.unPublishTraining(
      data.body.traningIds,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0012',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // upload training files of rider
  @MessagePattern('topic-rider-auth-PublishTraing')
  async publishTraing(@Payload() data) {
    const result = await this.trainingServices.publishTraining(
      data.body.traningIds,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0013',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find training files of rider
  @MessagePattern('topic-rider-auth-findAllTraining')
  async findTraining(@Payload() data) {
    const result = await this.trainingServices.find(data.query);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0012',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // find training files of rider
  @MessagePattern('topic-rider-auth-findByIdTraining')
  async findTrainingById(@Payload() data) {
    const result = await this.trainingServices.findById(data.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0012',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update training files of rider
  @MessagePattern('topic-rider-auth-updateTraining')
  async updateTraining(@Payload() data) {
    const result = await this.trainingServices.update(data.param.id, data.body);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0009',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // training questions and answers of rider
  @MessagePattern('topic-rider-auth-findTrainingQuestions')
  async findTrainingQuestions(@Payload() payload) {
    const result = await this.authService.findTrainingQuestions(
      payload.id,
      payload.role,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0010',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // training questions and answers validation of rider
  @MessagePattern('topic-rider-auth-validateTrainingQuestions')
  async validateTrainingQuestions(@Payload() data) {
    const result = await this.authService.validateTrainingQuestions(
      data.id,
      data.body.answers,
    );
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0011',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }

  // update training files of rider
  @MessagePattern('topic-rider-auth-deleteTraining')
  async deleteTraining(@Payload() data) {
    const result = await this.trainingServices.delete(data.param.id);
    if (result.isSuccess) {
      return formatResponse(
        result.isSuccess,
        result.code,
        'RIDER_S0012',
        result.body,
      );
    } else {
      return formatResponse(result.isSuccess, result.code, result.message);
    }
  }
}
