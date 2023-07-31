import { InternalServerErrorException } from '@nestjs/common';
import { KafkaConfig as KafkaConfigMicro } from '@nestjs/microservices/external/kafka.interface';
import { KafkaConfig } from 'kafkajs';

// Config Service for fetching all enviornment variables
class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  // method to get values of enviornment variables
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new InternalServerErrorException(
        `config error - missing env.${key}`,
      );
    }

    return value;
  }

  // method to ensure the availability of enviornment variables
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  // method to ensure build type
  public getPort() {
    return this.getValue('PORT', false);
  }

  // method to get values of enviornment variables within application
  public get(key: string): string {
    const value = this.env[key];
    if (!value) {
      return undefined;
    }
    return value;
  }

  // method to ensure build type
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode == 'PROD';
  }

  // method to get required configuration object for Kafka connection
  public getKafkaClientConfig(client): any {
    const mode = this.get('MODE');

    if (mode == 'DEV') {
      return {
        clientId: client,
        brokers: this.get('BROKERS').split(','),
      };
    }
    return {
      clientId: client,
      brokers: this.get('BROKERS').split(','),
      ssl: true,
      sasl: {
        mechanism: 'scram-sha-512', // scram-sha-256 or scram-sha-512
        username: this.get('BROKER_USERNAME'),
        password: this.get('BROKER_PASSWORD'),
      },
    };
  }
}

// ensure all important variables required to start a build
const configService = new ConfigService(process.env).ensureValues([
  'PORT',
  'MODE',
  'GOOGLE_APPLICATION_CREDENTIALS',
  'BROKERS',
  'BROKER_USERNAME',
  'BROKER_PASSWORD',
]);

export { configService };
