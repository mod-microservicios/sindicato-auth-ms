import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../configurations/prisma/prisma.module';
import { KafkaModule } from '../configurations/kafka/kafka.module';
import { UserEventsService } from './events/user-events.service';

@Module({
  imports: [PrismaModule, KafkaModule],
  controllers: [UserController],
  providers: [UserService, UserEventsService],
})
export class UserModule {}
