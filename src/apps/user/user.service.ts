import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../configurations/prisma/prisma.service';
import { UserEventsService } from './events/user-events.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private userEventsService: UserEventsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await  this.prisma.user.create({
      data: createUserDto,
    });
    console.log('llego al auth  created:', user);
    // Publicar evento de usuario creado
    await this.userEventsService.publishUserCreated({
      id: user.id,
      ci: user.ci,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      secondLastName: user.secondLastName || undefined,
      type: user.type,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    // Publicar evento de usuario actualizado
    await this.userEventsService.publishUserUpdated({
      id: user.id,
      ci: user.ci,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      secondLastName: user.secondLastName || undefined,
      type: user.type,
      updatedAt: user.updatedAt,
    });

    return user;
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
