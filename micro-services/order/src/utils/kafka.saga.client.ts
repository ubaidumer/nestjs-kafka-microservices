import { Client, Transport, ClientKafka } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';
import { configService } from 'src/config/config';
import { orderSagaTopicArray } from './constants/sagaTopicConstants';

export class kafkaClientManager {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: configService.getKafkaSagaClientConfig('OrderSagaClient'),
      consumer: {
        groupId: 'ORDER_SAGA_CONSUMER', // Should be the same thing we give in consumer
        allowAutoTopicCreation: true,
      },
    },
  })
  sagaClient: ClientKafka;

  async kafkaAdminCreateTopic() {
    const kafka = new Kafka(
      configService.getKafkaSagaClientConfig('OrderSagaClient'),
    );
    var admin = kafka.admin();

    // create new topic
    await admin.createTopics({
      waitForLeaders: true,
      topics: orderSagaTopicArray,
    });

    // list all topics
    // const topics = await admin.listTopics();
    // console.log(topics);
  }

  async onModuleInit() {
    await this.kafkaAdminCreateTopic();

    // Need to subscribe to topic
    // so that we can get the response from kafka microservice

    orderSagaTopicArray.forEach((element) => {
      this.sagaClient.subscribeToResponseOf(element.topic);
    });

    this.sagaClient.connect();
  }
}
