import { IsEmail, MinLength } from "class-validator";
import { UserType } from "generated/prisma/enums";
export class CreateUserDto {
    @MinLength(4)
    ci: string;
    @IsEmail({},{message: 'El correo no es válido'})
    email: string;
    @MinLength(4)
    password: string;
    @MinLength(2,{message: 'El nombre debe tener al menos 2 caracteres'})
    name: string;

    @MinLength(2,{message: 'El apellido debe tener al menos 2 caracteres'})
    lastName: string;


    @MinLength(2,{message: 'El segundo apellido debe tener al menos 2 caracteres'})
    secondLastName: string;

    @MinLength(6,{message: 'El celular debe tener al menos 6 digitos'})
    cellphone: string;

    profession?: string;
    type: UserType;
    createdAt?: Date;
    updatedAt?: Date;

}
