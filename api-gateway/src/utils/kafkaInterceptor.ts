import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaResponseInterceptor implements NestInterceptor {
  constructor(private readonly client: ClientKafka) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const topic = context.getArgByIndex(1)?.topic;
    const request = context.getArgByIndex(2);

    return next.handle().pipe(
      tap((response) => {
        if (response?.isSuccess === false) {
          throw new HttpException(
            response.message,
            response.code ? response.code : 400,
          );
        }
      }),
    );
  }
}
