import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';
import { obtenerPermisosUsuario } from '../../../utils/permisos';

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
    const [filtrados, setFiltrados] = useState<GrupoContable[]>([]);
    const [permisos, setPermisos] = useState<string[]>([]);

    const [filtroCodigo, setFiltroCodigo] = useState('');
    const [filtroDescripcion, setFiltroDescripcion] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS');
    const [filtroCreadoPor, setFiltroCreadoPor] = useState('');
    const [filtroActualizadoPor, setFiltroActualizadoPor] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const permisosUsuario = obtenerPermisosUsuario();
        setPermisos(permisosUsuario);
    }, []);

    useEffect(() => {
        if (permisos.includes('grupos-contables:listar')) {
            obtenerGrupos();
        } else {
            setCargando(false);
        }
    }, [estadoFiltro, permisos]);

    useEffect(() => {
        aplicarFiltros();
    }, [grupos, filtroCodigo, filtroDescripcion, filtroEstado, filtroCreadoPor, filtroActualizadoPor]);

    const aplicarFiltros = () => {
        let resultado = [...grupos];

        if (filtroEstado !== 'TODOS') {
            resultado = resultado.filter(g => g.estado === filtroEstado);
        }
        if (filtroCodigo.trim() !== '') {
            resultado = resultado.filter(g => g.codigo.toLowerCase().includes(filtroCodigo.toLowerCase()));
        }
        if (filtroDescripcion.trim() !== '') {
            resultado = resultado.filter(g => g.descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase()));
        }
        if (filtroCreadoPor.trim() !== '') {
            resultado = resultado.filter(g => g.creado_por?.nombre.toLowerCase().includes(filtroCreadoPor.toLowerCase()));
        }
        if (filtroActualizadoPor.trim() !== '') {
            resultado = resultado.filter(g => g.actualizado_por?.nombre?.toLowerCase().includes(filtroActualizadoPor.toLowerCase()));
        }

        resultado.sort((a, b) => a.codigo.localeCompare(b.codigo));
        setFiltrados(resultado);
    };

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
                headers: { Authorization: `Bearer ${token}` },
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
                headers: { Authorization: `Bearer ${token}` },
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
                { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } }
            );

            const blob = new Blob([response.data as Blob], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('❌ Error al exportar PDF:', error);
            alert('Ocurrió un error al exportar el PDF.');
        }
    };

    if (!permisos.includes('grupos-contables:listar')) {
        return (
            <div className="container mt-5 text-center">
                <h4 className="text-danger">
                    <i className="bi bi-shield-lock-fill me-2"></i>
                    Acceso denegado
                </h4>
                <p>No tienes permiso para ver los grupos contables.</p>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Grupos Contables</h4>
                    <p className="text-muted small">Gestión de grupos contables registrados</p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    {permisos.includes('grupos-contables:crear') && (
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/parametros/grupos-contables/registrar')}
                        >
                            <i className="bi bi-plus-lg me-1"></i> Nuevo Grupo
                        </button>
                    )}

                    {permisos.includes('grupos-contables:exportar-pdf') && (
                        <button className="btn btn-outline-success" onClick={exportarPDF}>
                            <i className="bi bi-file-earmark-pdf me-1"></i> Exportar PDF
                        </button>
                    )}

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate('/parametros')}
                    >
                        <i className="bi bi-arrow-left me-1"></i> Volver
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
                                <td colSpan={11} className="text-center">Cargando...</td>
                            </tr>
                        ) : filtrados.length > 0 ? (
                            filtrados.map((grupo, index) => (
                                <tr key={grupo.id}>
                                    <td>{index + 1}</td>
                                    <td>{grupo.codigo}</td>
                                    <td>{grupo.descripcion}</td>
                                    <td>{grupo.tiempo}</td>
                                    <td>{grupo.porcentaje}%</td>
                                    <td>{grupo.estado}</td>
                                    <td>{grupo.creado_por?.nombre || '—'}</td>
                                    <td>{new Date(grupo.created_at).toLocaleDateString('es-BO')}</td>
                                    <td>{grupo.actualizado_por?.nombre || '—'}</td>
                                    <td>{grupo.updated_at ? new Date(grupo.updated_at).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        {permisos.includes('grupos-contables:editar') && (
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => navigate(`/parametros/grupos-contables/editar/${grupo.id}`)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        )}

                                        {(permisos.includes('grupos-contables:cambiar-estado') ||
                                            permisos.includes('grupos-contables:eliminar')) && (
                                                <button
                                                    className={`btn btn-sm ${grupo.estado === 'ACTIVO' ? 'btn-secondary' : 'btn-success'}`}
                                                    title={grupo.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
                                                    onClick={() => cambiarEstado(grupo.id)}
                                                >
                                                    <i className="bi bi-arrow-repeat"></i>
                                                </button>
                                            )}


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
