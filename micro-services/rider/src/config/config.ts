import { InternalServerErrorException } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Address } from 'src/entity/address.entity';
import { Compliance } from 'src/entity/compliance.entity';
import { Feedback } from 'src/entity/feedback.entity';
import { FinancialAssistance } from 'src/entity/financial-assistance.entity';
import { LeaveManagement } from 'src/entity/leave-management.entity';
import { Rider } from 'src/entity/rider.entity';
import { ShiftManagement } from 'src/entity/shift-management.entity';
import { Training } from 'src/entity/training.entity';
import { DocumentManagement } from 'src/entity/document-management.entity';
import { Faqs } from 'src/entity/faqs.entity';

// Config Service for fetching all enviornment variables
class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  // method to get values of enviornment variables during application build
  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new InternalServerErrorException(
        `config error - missing env.${key}`,
      );
    }

    return value;
  }

  // method to get values of enviornment variables within application
  public get(key: string): string {
    const value = this.env[key];
    if (!value) {
      return undefined;
    }
    return value;
  }

  // method to get required configuration object for Kafka connection
  public getKafkaClientConfig(): any {
    const mode = this.get('MODE');

    if (mode == 'DEV') {
      return {
        brokers: this.get('BROKERS').split(','),
      };
    }
    return {
      brokers: this.get('BROKERS').split(','),
      ssl: true,
      sasl: {
        mechanism: 'scram-sha-512', // scram-sha-256 or scram-sha-512
        username: this.get('BROKER_USERNAME'),
        password: this.get('BROKER_PASSWORD'),
      },
    };
  }

  // method to ensure the availability of enviornment variables
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  // method to ensure build type
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode == 'PROD';
  }

  // method to get required configuration object for database connection
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: [
        Rider,
        Training,
        LeaveManagement,
        Address,
        Feedback,
        FinancialAssistance,
        Compliance,
        ShiftManagement,
        DocumentManagement,
        Faqs,
      ],
      logging: ['info'],
      synchronize: true,

      ssl: this.isProduction(),
    };
  }
  // method to get required configuration object for Kafka connection
  public getKafkaSagaClientConfig(client): any {
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
  'MODE',
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'GOOGLE_APPLICATION_CREDENTIALS',
  'AWS_S3_BUCKET_NAME',
  'AWS_S3_REGION_NAME',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'BROKERS',
]);

export { configService };
