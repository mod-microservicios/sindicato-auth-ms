import { Injectable, Logger, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

export interface UserEvent {
  id: string;
  ci: string;
  email: string;
  name: string;
  lastName: string;
  secondLastName?: string;
  type: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class UserEventsService implements OnModuleInit {
  private readonly logger = new Logger(UserEventsService.name);

  constructor(@Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    // Suscribirse a los topics para asegurar que existan
    this.kafkaClient.subscribeToResponseOf('user.created');
    this.kafkaClient.subscribeToResponseOf('user.updated');
    await this.kafkaClient.connect();
  }

  async publishUserCreated(user: UserEvent) {
    try {
      this.kafkaClient.emit('user.created', {
        id: user.id,
        ci: user.ci,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        secondLastName: user.secondLastName,
        type: user.type,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      this.logger.log(`User created event published for user: ${user.id}`);
    } catch (error) {
      this.logger.error(`Error publishing user created event: ${error.message}`, error.stack);
    }
  }

  async publishUserUpdated(user: UserEvent) {
    try {
      this.kafkaClient.emit('user.updated', {
        id: user.id,
        ci: user.ci,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        secondLastName: user.secondLastName,
        type: user.type,
        updatedAt: user.updatedAt,
      });
      this.logger.log(`User updated event published for user: ${user.id}`);
    } catch (error) {
      this.logger.error(`Error publishing user updated event: ${error.message}`, error.stack);
    }
  }
}

