import { PartialType } from '@nestjs/mapped-types';
import { CreateUnidadOrganizacionalDto } from './create-unidad-organizacional.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateUnidadOrganizacionalDto extends PartialType(CreateUnidadOrganizacionalDto) {
    @IsOptional()
    @IsNumber()
    actualizado_por_id?: number;
}
