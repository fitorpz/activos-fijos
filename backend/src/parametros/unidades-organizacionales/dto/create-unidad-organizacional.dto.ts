import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUnidadOrganizacionalDto {
    @IsNotEmpty()
    @IsString()
    codigo: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsNotEmpty()
    @IsString()
    area: string;

    @IsNotEmpty()
    creado_por_id: number;
}
