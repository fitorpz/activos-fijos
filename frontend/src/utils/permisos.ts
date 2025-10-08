// src/utils/permisos.ts
import { Permiso } from '../interfaces/interfaces';
import { jwtDecode } from 'jwt-decode';
import axios from './axiosConfig';

/**
 * Agrupa los permisos por módulo para mostrarlos en acordeones.
 */
export function agruparPermisosPorModulo(permisos: Permiso[]) {
    return permisos.reduce((acc: Record<string, Permiso[]>, permiso) => {
        const modulo = permiso.modulo || 'Otros';
        if (!acc[modulo]) acc[modulo] = [];
        acc[modulo].push(permiso);
        return acc;
    }, {});
}

/**
 * Verifica si un usuario tiene un permiso específico.
 */
export function tienePermiso(usuario: any, permiso: string): boolean {
    return usuario?.rol?.permisos?.includes(permiso);
}

/**
 * Obtiene los permisos del usuario desde el token JWT almacenado.
 */
export function obtenerPermisosUsuario(): string[] {
    const token = localStorage.getItem('token');
    if (!token) return [];

    try {
        const decoded: any = jwtDecode(token);

        // Si el token tiene permisos directos
        if (decoded.permisos && Array.isArray(decoded.permisos)) {
            return decoded.permisos.map((p: any) =>
                typeof p === 'string' ? p : p.nombre
            );
        }

        // Si los permisos vienen dentro del rol
        if (decoded.rol && Array.isArray(decoded.rol.permisos)) {
            return decoded.rol.permisos.map((p: any) =>
                typeof p === 'string' ? p : p.nombre
            );
        }

        return [];
    } catch (error) {
        console.error('Error al decodificar permisos:', error);
        return [];
    }
}

/**
 * 🔄 Refresca los permisos directamente desde el backend
 * (sin necesidad de cerrar sesión o regenerar el token)
 */
export const refrescarPermisosUsuario = async (): Promise<string[]> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return [];

        const res = await axios.get<{ permisos: string[] }>('/usuarios/permisos/actualizados', {
            headers: { Authorization: `Bearer ${token}` },
        });

        const permisos = res.data?.permisos || [];
        localStorage.setItem('permisos', JSON.stringify(permisos));
        return permisos;
    } catch (error) {
        console.error('❌ Error al refrescar permisos:', error);
        return [];
    }
};
