import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol?: string;
}

export interface UnidadOrganizacional {
    id: number;
    codigo: string;
    descripcion: string;
    area: string;
    creado_por: Usuario;
    creado_por_id: number;
    actualizado_por?: Usuario | null;
    actualizado_por_id?: number | null;
    created_at: string;
    updated_at?: string | null;
}

const UnidadesOrganizacionales = () => {
    const [unidades, setUnidades] = useState<UnidadOrganizacional[]>([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerUnidades();
    }, []);

    const obtenerUnidades = async () => {
        try {
            const res = await axios.get<UnidadOrganizacional[]>('/parametros/unidades-organizacionales');
            setUnidades(res.data);
        } catch (error) {
            console.error('Error al obtener unidades organizacionales:', error);
        } finally {
            setCargando(false);
        }
    };

    const eliminarUnidad = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar esta unidad organizacional?')) return;
        try {
            await axios.delete(`/parametros/unidades-organizacionales/${id}`);
            obtenerUnidades(); // recargar la lista
        } catch (error) {
            console.error('Error al eliminar la unidad organizacional:', error);
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Unidades Organizacionales</h4>

            <button
                className="btn btn-primary mb-3"
                onClick={() => navigate('/parametros/unidades-organizacionales/registrar')}
            >
                <i className="bi bi-plus-lg me-1"></i> Nueva Unidad
            </button>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nro.</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Área</th>
                            <th>Creado por</th>
                            <th>Fecha de Registro</th>
                            <th>Actualizado por</th>
                            <th>Fecha de Actualización</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={9} className="text-center">Cargando datos...</td>
                            </tr>
                        ) : unidades.length > 0 ? (
                            unidades.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.descripcion}</td>
                                    <td>{item.area}</td>
                                    <td>
                                        {item.creado_por
                                            ? `${item.creado_por.nombre}${item.creado_por.rol ? ` (${item.creado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>
                                        {item.created_at
                                            ? new Date(item.created_at).toLocaleDateString('es-BO')
                                            : '—'}
                                    </td>
                                    <td>
                                        {item.actualizado_por
                                            ? `${item.actualizado_por.nombre}${item.actualizado_por.rol ? ` (${item.actualizado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>
                                        {item.updated_at
                                            ? new Date(item.updated_at).toLocaleDateString('es-BO')
                                            : '—'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/unidades-organizacionales/editar/${item.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => eliminarUnidad(item.id)}
                                        >
                                            <i className="bi bi-trash3"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center">No hay registros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UnidadesOrganizacionales;
