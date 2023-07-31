import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RiderService } from '../rider/rider.service';

// Routes for Auth Api's
@Controller()
export class AuthSagaController {
  constructor(private readonly riderService: RiderService) {}

  // find all Authes route
  @MessagePattern('saga-topic-order-to-rider-updateRider')
  async adminFindAllAuth(@Payload() payload) {
    return await this.riderService.updateRider(payload.id, payload.data);
  }
}
