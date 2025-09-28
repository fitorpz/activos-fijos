import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

export interface Usuario {
    id: number;
    nombre: string;
    correo: string;
    rol?: string;
}

export interface Auxiliar {
    id: number;
    codigo: string;
    descripcion: string;
    codigo_grupo: string;
    estado: 'ACTIVO' | 'INACTIVO';
    creado_por: Usuario;
    created_at: string;
    actualizado_por?: Usuario | null;
    updated_at?: string | null;
}

export interface GrupoContable {
    id: number;
    codigo: string;
    descripcion: string;
    estado: 'ACTIVO' | 'INACTIVO';
}

const Auxiliares = () => {
    const [auxiliares, setAuxiliares] = useState<Auxiliar[]>([]);
    const [gruposContables, setGruposContables] = useState<GrupoContable[]>([]);
    const [codigoGrupoFiltro, setCodigoGrupoFiltro] = useState<string>('');
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerGruposContables();
    }, []);

    useEffect(() => {
        obtenerAuxiliares();
    }, [estadoFiltro, codigoGrupoFiltro]);

    const obtenerGruposContables = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get<GrupoContable[]>('/parametros/grupos-contables', {
                params: { estado: 'ACTIVO' },
                headers: { Authorization: `Bearer ${token}` },
            });
            setGruposContables(res.data);
        } catch (error) {
            console.error('Error al obtener grupos contables:', error);
        }
    };

    const obtenerAuxiliares = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await axios.get<Auxiliar[]>('/parametros/auxiliares', {
                params: {
                    estado:
                        estadoFiltro === 'activos'
                            ? 'ACTIVO'
                            : estadoFiltro === 'inactivos'
                                ? 'INACTIVO'
                                : 'todos',
                    ...(codigoGrupoFiltro ? { codigo_grupo: codigoGrupoFiltro } : {})
                },
                headers: { Authorization: `Bearer ${token}` },
            });

            const ordenados = [...res.data].sort((a, b) => a.codigo.localeCompare(b.codigo));
            setAuxiliares(ordenados);
        } catch (error) {
            console.error('Error al obtener auxiliares:', error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id: number) => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de este auxiliar?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/parametros/auxiliares/${id}/cambiar-estado`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            obtenerAuxiliares();
        } catch (error) {
            console.error('Error al cambiar estado:', error);
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
                `/parametros/auxiliares/exportar/pdf?estado=${estadoSeleccionado}&codigo_grupo=${codigoGrupoFiltro}`,
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
                    <h4 className="mb-0">Auxiliares</h4>
                    <p className="text-muted small">Gestión de auxiliares registrados</p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/parametros/auxiliares/registrar')}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Nuevo Auxiliar
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

                    <div style={{ minWidth: '220px' }}>
                        <select
                            className="form-select"
                            value={codigoGrupoFiltro}
                            onChange={(e) => setCodigoGrupoFiltro(e.target.value)}
                        >
                            <option value="">Todos los Grupos</option>
                            {gruposContables.map(grupo => (
                                <option key={grupo.id} value={grupo.codigo}>
                                    {grupo.codigo} - {grupo.descripcion}
                                </option>
                            ))}
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
                            <th>Código Grupo</th>
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
                                <td colSpan={10} className="text-center">Cargando datos...</td>
                            </tr>
                        ) : auxiliares.length > 0 ? (
                            auxiliares.map((aux, index) => (
                                <tr key={aux.id}>
                                    <td>{index + 1}</td>
                                    <td>{aux.codigo}</td>
                                    <td>{aux.descripcion}</td>
                                    <td>{aux.codigo_grupo || '—'}</td>
                                    <td>{aux.estado}</td>
                                    <td>
                                        {aux.creado_por
                                            ? `${aux.creado_por.nombre}${aux.creado_por.rol ? ` (${aux.creado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>{new Date(aux.created_at).toLocaleDateString('es-BO')}</td>
                                    <td>
                                        {aux.actualizado_por
                                            ? `${aux.actualizado_por.nombre}${aux.actualizado_por.rol ? ` (${aux.actualizado_por.rol})` : ''}`
                                            : '—'}
                                    </td>
                                    <td>
                                        {aux.updated_at
                                            ? new Date(aux.updated_at).toLocaleDateString('es-BO')
                                            : '—'}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/auxiliares/editar/${aux.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${aux.estado === 'ACTIVO' ? 'btn-secondary' : 'btn-success'}`}
                                            title={aux.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
                                            onClick={() => cambiarEstado(aux.id)}
                                        >
                                            <i className="bi bi-arrow-repeat"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center">No hay registros.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Auxiliares;