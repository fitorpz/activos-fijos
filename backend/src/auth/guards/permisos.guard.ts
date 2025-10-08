import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISO_KEY } from '../permisos.decorator';
import { RequestWithUser } from 'src/interfaces/request-with-user.interface';


@Injectable()
export class PermisosGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const permisoRequerido = this.reflector.get<string>(PERMISO_KEY, context.getHandler());
        if (!permisoRequerido) return true;

        const request = context.switchToHttp().getRequest<RequestWithUser>(); 
        const usuario = request.user;

        // Ahora sí reconoce usuario.rol.permisos
        const permisos: string[] = usuario?.rol?.permisos?.map((p: any) => p.nombre) || [];

        if (!permisos.includes(permisoRequerido)) {
            throw new ForbiddenException(`No tiene el permiso: ${permisoRequerido}`);
        }

        return true;
    }
}
