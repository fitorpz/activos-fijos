import { Controller, Get, Post, Body } from '@nestjs/common';
import { PermisosService } from './permisos.service';

@Controller('permisos')
export class PermisosController {
    constructor(private readonly permisosService: PermisosService) { }

    @Get()
    findAll() { return this.permisosService.findAll(); }

    @Post()
    create(@Body() data: any) { return this.permisosService.create(data); }
}
