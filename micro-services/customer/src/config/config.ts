import { InternalServerErrorException } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Address } from 'src/entity/address.entity';
import { CustomerAffair } from 'src/entity/customer-affair.entity';
import { CustomerFav } from 'src/entity/customer-fav.entity';
import { Customer } from 'src/entity/customer.entity';

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
  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode == 'PROD';
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

  // method to get required configuration object for database connection
  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      entities: [Customer, Address, CustomerFav, CustomerAffair],
      logging: ['info'],
      synchronize: true,

      ssl: this.isProduction(),
    };
  }

  // method to get required configuration object for twillio connection
  public getTwillioConfig() {
    return {
      accountSid: this.getValue('TWILIO_ACCOUNT_SID'),
      authToken: this.getValue('TWILIO_AUTH_TOKEN'),
    };
  }

  public getTwilioVerifyService() {
    return { serviceSid: this.getValue('TWILIO_VERIFY_SERVICE_SID') };
  }

  public getTwilioMessagesService() {
    return { serviceSid: this.getValue('TWILIO_MESSAGES_SERVICE_SID') };
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
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_MESSAGES_SERVICE_SID',
  'TWILIO_VERIFY_SERVICE_SID',
  'BROKERS',
]);

export { configService };
