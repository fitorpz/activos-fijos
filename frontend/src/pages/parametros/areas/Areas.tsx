import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol?: string;
}

export interface Area {
    id: number;
    codigo: string;
    descripcion: string;
    estado: 'ACTIVO' | 'INACTIVO';
    creado_por: Usuario;
    created_at: string;
    actualizado_por?: Usuario | null;
    updated_at?: string | null;
}

const Areas = () => {
    const [areas, setAreas] = useState<Area[]>([]);
    const [cargando, setCargando] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos');
    const navigate = useNavigate();

    useEffect(() => {
        obtenerAreas();
    }, [estadoFiltro]);

    const obtenerAreas = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get<Area[]>('/parametros/areas', {
                params: estadoFiltro
                    ? {
                        estado:
                            estadoFiltro === 'activos'
                                ? 'ACTIVO'
                                : estadoFiltro === 'inactivos'
                                    ? 'INACTIVO'
                                    : 'todos',
                    }
                    : {},
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAreas(res.data);
        } catch (error) {
            console.error('Error al obtener áreas:', error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id: number) => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de esta área?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/parametros/areas/${id}/cambiar-estado`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            obtenerAreas();
        } catch (error) {
            console.error('Error al cambiar el estado del área:', error);
        }
    };

    const exportarPDF = async () => {
        const token = localStorage.getItem('token');
        const estadoSeleccionado =
            estadoFiltro === 'activos'
                ? 'ACTIVO'
                : estadoFiltro === 'inactivos'
                    ? 'INACTIVO'
                    : 'todos';

        try {
            const response = await axios.get(
                `/parametros/areas/exportar/pdf?estado=${estadoSeleccionado}`,
                {
                    responseType: 'blob',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const blob = new Blob([response.data as Blob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('❌ Error al exportar PDF:', error);
            alert('Ocurrió un error al exportar el PDF.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Áreas</h4>
                    <p className="text-muted small">Gestión de registros por área</p>
                </div>

                <div className="d-flex flex-wrap gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/parametros/areas/registrar')}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Nueva Área
                    </button>

                    <button className="btn btn-outline-success ms-2" onClick={exportarPDF}>
                        <i className="bi bi-file-earmark-pdf me-1"></i> Exportar PDF
                    </button>

                    <select
                        id="filtro-estado"
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                        className="form-select"
                    >
                        <option value="todos">Todos</option>
                        <option value="activos">Solo Activos</option>
                        <option value="inactivos">Solo Inactivos</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nro.</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Estado</th>
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
                        ) : areas.length > 0 ? (
                            areas.map((area, index) => (
                                <tr key={area.id}>
                                    <td>{index + 1}</td>
                                    <td>{area.codigo}</td>
                                    <td>{area.descripcion}</td>
                                    <td>{area.estado}</td>
                                    <td>
                                        {area.creado_por
                                            ? `${area.creado_por.nombre}${area.creado_por.rol ? ` (${area.creado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>{new Date(area.created_at).toLocaleDateString('es-BO')}</td>
                                    <td>
                                        {area.actualizado_por
                                            ? `${area.actualizado_por.nombre}${area.actualizado_por.rol ? ` (${area.actualizado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>
                                        {area.updated_at
                                            ? new Date(area.updated_at).toLocaleDateString('es-BO')
                                            : '—'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/areas/editar/${area.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${area.estado === 'ACTIVO' ? 'btn-secondary' : 'btn-success'}`}
                                            title={area.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
                                            onClick={() => cambiarEstado(area.id)}
                                        >
                                            <i className="bi bi-arrow-repeat"></i>
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

export default Areas;
