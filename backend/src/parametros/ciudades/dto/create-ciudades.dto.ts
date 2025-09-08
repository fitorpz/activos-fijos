import { IsNotEmpty } from 'class-validator';

export class CreateCiudadesDto {
    @IsNotEmpty()
    codigo: string;

    @IsNotEmpty()
    descripcion: string;
}
