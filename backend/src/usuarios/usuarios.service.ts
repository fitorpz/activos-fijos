import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';
import { IsNull } from 'typeorm';



@Injectable()
export class UsuariosService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) { }

    async buscarPorCorreo(correo: string) {
        return this.usuarioRepository.findOne({ where: { correo } });
    }

    async create(data: CreateUsuarioDto, creadorId?: number, yaHasheado = false): Promise<Usuario> {
        // Si la contraseña no está hasheada, la hasheamos aquí
        const contrasenaFinal = yaHasheado
            ? data.contrasena
            : await bcrypt.hash(data.contrasena, 10);

        const nuevoUsuario = this.usuarioRepository.create({
            correo: data.correo,
            contrasena: contrasenaFinal,
            rol: data.rol,
            nombre: data.nombre,
            creadoPorId: creadorId,
        });

        return this.usuarioRepository.save(nuevoUsuario);
    }

    async update(id: number, data: Partial<CreateUsuarioDto>): Promise<Usuario> {
        try {
            const usuario = await this.usuarioRepository.findOneBy({ id });
            if (!usuario) {
                throw new Error('Usuario no encontrado');
            }

            if (data.contrasena) {
                data.contrasena = await bcrypt.hash(data.contrasena, 10);
            }

            Object.assign(usuario, data);
            return await this.usuarioRepository.save(usuario);
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            throw new Error('No se pudo actualizar el usuario');
        }
    }

    async remove(id: number): Promise<{ message: string }> {
        const resultado = await this.usuarioRepository.softDelete(id); // ✅ Soft delete
        if (resultado.affected === 0) {
            throw new Error('Usuario no encontrado');
        }
        return { message: 'Usuario eliminado correctamente' };
    }


    async findOne(id: number): Promise<Usuario | null> {
        return this.usuarioRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Usuario[]> {
        return this.usuarioRepository.find({
            where: { deletedAt: IsNull() }, // ✅ Esto evita el error de tipo
            relations: ['creadoPor'],
            order: { id: 'ASC' }
        });
    }




    async restaurar(id: number): Promise<{ message: string }> {
        const resultado = await this.usuarioRepository.restore(id);

        if (resultado.affected === 0) {
            throw new Error('El usuario no existe o ya está activo');
        }

        return { message: 'Usuario restaurado correctamente' };
    }


}
