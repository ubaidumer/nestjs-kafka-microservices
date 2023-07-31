import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as firebaseAdmin from 'firebase-admin';
import { configService } from './config/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: configService.getKafkaClientConfig(),
        consumer: {
          groupId: 'ADMIN_CONSUMER',
        },
      },
    },
  );
  await firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
  });
  app.listen();
}
bootstrap();
