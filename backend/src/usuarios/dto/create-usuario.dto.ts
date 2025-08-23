import { RolUsuario } from '../enums/rol-usuario.enum';
import { IsEmail, IsEnum, IsString, IsOptional } from 'class-validator';

export class CreateUsuarioDto {
    @IsEmail()
    correo: string;

    @IsString()
    contrasena: string;

    @IsOptional()
    nombre?: string;

    @IsEnum(RolUsuario)
    rol: RolUsuario;
}
