import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Put,
    Patch,
    Param,
    Delete,
    Req,
    BadRequestException,
    NotFoundException
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UserLogService } from '../user-log/user-log.service';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('usuarios')
export class UsuariosController {
    constructor(
        private readonly usuariosService: UsuariosService,
        private readonly userLogService: UserLogService,
    ) { }

    // ✅ Crear un nuevo usuario (protegido con JWT)
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async create(
        @Body() createDto: CreateUsuarioDto,
        @Req() request: Request
    ) {
        const user = request.user as any;
        if (!user || !user.id) {
            throw new BadRequestException('No se pudo obtener el usuario autenticado.');
        }
        const usuario = await this.usuariosService.create(createDto, user.id);
        await this.userLogService.registrarLog(
            usuario.id,
            'Registró un nuevo usuario',
            JSON.stringify(createDto),
            request.ip,
            request.headers['user-agent'],
        );
        return {
            message: 'Usuario registrado correctamente',
            usuario,
        };
    }

    // ✅ Actualizar usuario (PUT)
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    update(@Param('id') id: string, @Body() data: Partial<CreateUsuarioDto>) {
        return this.usuariosService.update(Number(id), data);
    }

    // ✅ Actualización parcial (PATCH)
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id')
    patch(@Param('id') id: string, @Body() data: Partial<CreateUsuarioDto>) {
        return this.usuariosService.update(Number(id), data);
    }

    // ✅ Obtener todos los usuarios
    @UseGuards(AuthGuard('jwt'))
    @Get()
    findAll() {
        return this.usuariosService.findAll();
    }

    // ✅ Obtener usuario por ID
    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: number) {
        const usuario = await this.usuariosService.findOne(+id);
        if (!usuario) throw new NotFoundException('Usuario no encontrado');
        return usuario;
    }

    // ✅ Eliminar usuario
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.usuariosService.remove(id);
    }
    // ✅ Restaurar usuario
    @UseGuards(AuthGuard('jwt'))
    @Patch('restaurar/:id')
    async restaurar(@Param('id') id: number) {
        await this.usuariosService.restaurar(id);
        return { message: 'Usuario restaurado correctamente' };
    }
}
