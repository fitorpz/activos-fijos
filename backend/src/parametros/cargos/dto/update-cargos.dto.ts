import { PartialType } from '@nestjs/mapped-types';
import { CreateCargosDto } from './create-cargos.dto';

export class UpdateCargosDto extends PartialType(CreateCargosDto) { }
