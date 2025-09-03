import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol?: string;
}

export interface GrupoContable {
    id: number;
    codigo: string;
    descripcion: string;
    tiempo: number;
    porcentaje: number;
    estado: 'ACTIVO' | 'INACTIVO';
    creado_por: Usuario;
    created_at: string;
    actualizado_por?: Usuario | null;
    updated_at?: string | null;
}

const GruposContables = () => {
    const [grupos, setGrupos] = useState<GrupoContable[]>([]);
    const [cargando, setCargando] = useState(true);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos');
    const navigate = useNavigate();

    useEffect(() => {
        obtenerGrupos();
    }, [estadoFiltro]);

    const obtenerGrupos = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get<GrupoContable[]>('/parametros/grupos-contables', {
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
            setGrupos(res.data);
        } catch (error) {
            console.error('Error al obtener grupos contables:', error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id: number) => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de este grupo contable?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/parametros/grupos-contables/${id}/cambiar-estado`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            obtenerGrupos();
        } catch (error) {
            console.error('Error al cambiar el estado del grupo contable:', error);
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
                `/parametros/grupos-contables/exportar/pdf?estado=${estadoSeleccionado}`,
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
                    <h4 className="mb-0">Grupos Contables</h4>
                    <p className="text-muted small">Gestión de grupos contables registrados</p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/parametros/grupos-contables/registrar')}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Nuevo Grupo
                    </button>

                    <button className="btn btn-outline-success" onClick={exportarPDF}>
                        <i className="bi bi-file-earmark-pdf me-1"></i> Exportar PDF
                    </button>

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/parametros')}
                    >
                        <i className="bi bi-arrow-left me-1"></i> Volver a Parámetros
                    </button>

                    <div style={{ minWidth: '160px' }}>
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
            </div>


            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nro.</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Tiempo</th>
                            <th>Porcentaje</th>
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
                                <td colSpan={11} className="text-center">Cargando datos...</td>
                            </tr>
                        ) : grupos.length > 0 ? (
                            grupos.map((grupo, index) => (
                                <tr key={grupo.id}>
                                    <td>{index + 1}</td>
                                    <td>{grupo.codigo}</td>
                                    <td>{grupo.descripcion}</td>
                                    <td>{grupo.tiempo}</td>
                                    <td>{grupo.porcentaje}%</td>
                                    <td>{grupo.estado}</td>
                                    <td>
                                        {grupo.creado_por
                                            ? `${grupo.creado_por.nombre}${grupo.creado_por.rol ? ` (${grupo.creado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>{new Date(grupo.created_at).toLocaleDateString('es-BO')}</td>
                                    <td>
                                        {grupo.actualizado_por
                                            ? `${grupo.actualizado_por.nombre}${grupo.actualizado_por.rol ? ` (${grupo.actualizado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>
                                        {grupo.updated_at
                                            ? new Date(grupo.updated_at).toLocaleDateString('es-BO')
                                            : '—'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/grupos-contables/editar/${grupo.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${grupo.estado === 'ACTIVO' ? 'btn-secondary' : 'btn-success'}`}
                                            title={grupo.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
                                            onClick={() => cambiarEstado(grupo.id)}
                                        >
                                            <i className="bi bi-arrow-repeat"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={11} className="text-center">No hay registros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GruposContables;
