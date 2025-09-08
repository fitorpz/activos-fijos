import { IsNotEmpty } from 'class-validator';

export class CreateNucleosDto {
    @IsNotEmpty()
    codigo: string;

    @IsNotEmpty()
    descripcion: string;
}
