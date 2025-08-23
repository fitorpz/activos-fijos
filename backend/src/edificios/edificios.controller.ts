import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Req,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EdificiosService } from './edificios.service';
import { CreateEdificioDto } from './dto/create-edificio.dto';
import { UpdateEdificioDto } from './dto/update-edificio.dto';
import type { RequestWithUser } from '../interfaces/request-with-user.interface';

@Controller('edificios')
@UseGuards(AuthGuard('jwt')) // Protege todas las rutas
export class EdificiosController {
    constructor(private readonly edificiosService: EdificiosService) { }

    // Crear un edificio
    @Post()
    async create(
        @Body() dto: CreateEdificioDto,
        @Req() req: RequestWithUser
    ) {
        const userId = req.user.id;
        const result = await this.edificiosService.create(dto, userId);
        return {
            message: 'Edificio creado correctamente',
            data: result,
        };
    }

    // Obtener un edificio por ID
    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequestWithUser
    ) {
        const result = await this.edificiosService.findOne(id);
        return {
            message: 'Edificio encontrado',
            data: result,
        };
    }

    // Listar todos los edificios activos (con creadoPor y actualizadoPor)
    @Get()
    async findAll() {
        const edificios = await this.edificiosService.findAll();

        // Mapear para devolver nombre de usuarios si existen
        const resultado = edificios.map((e) => ({
            ...e,
            creado_por: e.creadoPor?.nombre || null,
            actualizado_por: e.actualizadoPor?.nombre || null,
        }));

        return {
            message: 'Listado de edificios',
            data: resultado,
        };
    }

    // Actualizar un edificio
    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() dto: UpdateEdificioDto,
        @Req() req: RequestWithUser
    ) {
        const userId = req.user.id;
        const result = await this.edificiosService.update(id, dto, userId);
        return {
            message: `Edificio con ID ${id} actualizado correctamente`,
            data: result,
        };
    }

    // Eliminar un edificio (soft delete)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const result = await this.edificiosService.remove(id);
        return result;
    }

    // Restaurar un edificio eliminado
    @Put('restaurar/:id')
    async restore(@Param('id', ParseIntPipe) id: number) {
        const result = await this.edificiosService.restore(id);
        return {
            message: `Edificio con ID ${id} restaurado correctamente`,
            data: result,
        };
    }
}
