import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISOS_KEY } from '../permisos.decorator';

@Injectable()
export class PermisosGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const permisosRequeridos = this.reflector.getAllAndOverride<string[]>(
            PERMISOS_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!permisosRequeridos || permisosRequeridos.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('Usuario no autenticado o token inválido');
        }

        const permisosUsuario: string[] =
            user.permisos ||
            user?.rol?.permisos?.map((p: any) =>
                typeof p === 'object' ? p.nombre : p,
            ) ||
            [];

        console.log('🧩 [PermisosGuard] Permisos del usuario:', permisosUsuario);
        console.log('🧩 [PermisosGuard] Permisos requeridos:', permisosRequeridos);

        if (!Array.isArray(permisosUsuario) || permisosUsuario.length === 0) {
            console.log('❌ [PermisosGuard] Usuario sin permisos asignados');
            throw new ForbiddenException('Usuario sin permisos asignados');
        }

        const tienePermiso = permisosRequeridos.every((permiso) =>
            permisosUsuario.includes(permiso),
        );

        if (!tienePermiso) {
            console.log('🚫 [PermisosGuard] Acceso denegado (sin permiso)');
            throw new ForbiddenException(
                `Acceso denegado: requiere (${permisosRequeridos.join(', ')})`,
            );
        }

        console.log('✅ [PermisosGuard] Acceso concedido');
        return true;
    }
}
