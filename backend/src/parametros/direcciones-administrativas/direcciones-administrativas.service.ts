import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { DireccionAdministrativa } from './entities/direcciones-administrativas.entity';
import { CreateDireccionesAdministrativasDto } from './dto/create-direcciones-administrativa.dto';
import { UpdateDireccionesAdministrativasDto } from './dto/update-direcciones-administrativa.dto';

@Injectable()
export class DireccionesAdministrativasService {
  constructor(
    @InjectRepository(DireccionAdministrativa)
    private readonly direccionAdministrativaRepository: Repository<DireccionAdministrativa>,
  ) { }

  async create(dto: CreateDireccionesAdministrativasDto, userId: number) {
    const entidad = this.direccionAdministrativaRepository.create({
      ...dto,
      creado_por: { id: userId } as any, // asocia el usuario creador
    });
    return this.direccionAdministrativaRepository.save(entidad);
  }

  async findAll(): Promise<DireccionAdministrativa[]> {
    return this.direccionAdministrativaRepository.find({
      where: { deleted_at: IsNull() },
      relations: ['creado_por', 'actualizado_por'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const registro = await this.direccionAdministrativaRepository.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['creado_por', 'actualizado_por'],
    });

    if (!registro) {
      throw new NotFoundException('Dirección no encontrada');
    }
    return registro;
  }

  async update(
    id: number,
    dto: UpdateDireccionesAdministrativasDto,
    userId: number,
  ) {
    const registro = await this.findOne(id);

    Object.assign(registro, dto);
    registro.actualizado_por = { id: userId } as any;

    return this.direccionAdministrativaRepository.save(registro);
  }

  async remove(id: number): Promise<{ message: string }> {
    // Soft delete directo por id (no necesitas hacer el findOne antes)
    const result = await this.direccionAdministrativaRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Dirección no encontrada');
    }
    return { message: 'Dirección eliminada correctamente' };
  }
}
