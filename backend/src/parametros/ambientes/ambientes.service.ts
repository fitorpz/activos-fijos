import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Ambiente } from './entities/ambiente.entity';
import { CreateAmbienteDto } from './dto/create-ambiente.dto';
import { UpdateAmbienteDto } from './dto/update-ambiente.dto';
import { UnidadOrganizacional } from 'src/parametros/unidades-organizacionales/entities/unidad-organizacional.entity';

@Injectable()
export class AmbientesService {
  constructor(
    @InjectRepository(Ambiente)
    private readonly ambienteRepository: Repository<Ambiente>,

    @InjectRepository(UnidadOrganizacional)
    private readonly unidadOrganizacionalRepository: Repository<UnidadOrganizacional>,
  ) { }

  async create(dto: CreateAmbienteDto, userId: number) {
    const unidad = await this.unidadOrganizacionalRepository.findOne({
      where: { id: dto.unidad_organizacional_id },
    });

    if (!unidad) throw new NotFoundException('Unidad organizacional no encontrada');

    // Obtener el número siguiente de ambiente
    const ambientes = await this.ambienteRepository.find({
      where: {
        unidad_organizacional: { id: unidad.id },
        deleted_at: IsNull(),
      },
    });

    const numero = ambientes.length + 1;
    const numeroStr = numero.toString().padStart(2, '0'); // Ej: 01, 02
    const codigoFinal = `${unidad.codigo}.${numeroStr}`; // Ej: E2.001.01

    const nuevo = this.ambienteRepository.create({
      codigo: codigoFinal,
      descripcion: dto.descripcion,
      unidad_organizacional: unidad,
      creado_por: { id: userId } as any,
    });

    return this.ambienteRepository.save(nuevo);
  }

  findAll(): Promise<Ambiente[]> {
    return this.ambienteRepository.find({
      where: { deleted_at: IsNull() },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number) {
    const ambiente = await this.ambienteRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!ambiente) {
      throw new NotFoundException('Ambiente no encontrado');
    }

    return ambiente;
  }

  async update(id: number, dto: UpdateAmbienteDto, userId: number) {
    const ambiente = await this.findOne(id);

    Object.assign(ambiente, dto);
    ambiente.actualizado_por = { id: userId } as any;

    return this.ambienteRepository.save(ambiente);
  }

  async remove(id: number) {
    const result = await this.ambienteRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Ambiente no encontrado');
    }

    return { message: 'Ambiente eliminado correctamente' };
  }
}
