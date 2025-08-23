import { IsNotEmpty } from 'class-validator';

export class CreateDireccionesAdministrativasDto {
    @IsNotEmpty()
    codigo: string;

    @IsNotEmpty()
    descripcion: string;
}
