import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface Usuario {
    id: number;
    nombre: string;
    rol: string;
    correo: string;
}

interface Distrito {
    id: number;
    codigo: string;
    descripcion: string;
    estado: 'ACTIVO' | 'INACTIVO';
    creado_por: Usuario;
    actualizado_por?: Usuario;
    created_at: string;
    updated_at?: string;
}

const Distritos = () => {
    const [ciudades, setDistritos] = useState<Distrito[]>([]);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerDistritos();
    }, [estadoFiltro]);

    const obtenerDistritos = async () => {
        setCargando(true);
        try {
            const res = await axios.get<Distrito[]>('/parametros/distritos', {
                params: {
                    estado:
                        estadoFiltro === 'activos'
                            ? 'ACTIVO'
                            : estadoFiltro === 'inactivos'
                                ? 'INACTIVO'
                                : 'todos',
                },
            });
            setDistritos(res.data);
        } catch (error) {
            console.error('❌ Error al obtener distritos:', error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id: number) => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de este distrito?')) return;
        try {
            await axios.put(`/parametros/distritos/${id}/cambiar-estado`);
            obtenerDistritos();
        } catch (error) {
            console.error('❌ Error al cambiar distrito:', error);
        }
    };

    const exportarPDF = async () => {
        const estado = estadoFiltro === 'activos' ? 'ACTIVO' : estadoFiltro === 'inactivos' ? 'INACTIVO' : 'todos';
        try {
            const res = await axios.get<Blob>(`/parametros/distritos/exportar/pdf?estado=${estado}`, {
                responseType: 'blob',
            });
            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('❌ Error al exportar PDF:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="mb-0">Distritos</h4>
                    <p className="text-muted small">Gestión de distritos registrados</p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    <button className="btn btn-primary" onClick={() => navigate('/parametros/distritos/nuevo')}>
                        <i className="bi bi-plus-lg me-1"></i> Nuevo Distrito
                    </button>

                    <button className="btn btn-outline-success" onClick={exportarPDF}>
                        <i className="bi bi-file-earmark-pdf me-1"></i> Exportar PDF
                    </button>

                    <button className="btn btn-outline-secondary" onClick={() => navigate('/parametros')}>
                        <i className="bi bi-arrow-left me-1"></i> Volver a Parametros
                    </button>

                    <div style={{ minWidth: '160px' }}>
                        <select
                            className="form-select"
                            value={estadoFiltro}
                            onChange={(e) => setEstadoFiltro(e.target.value)}
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
                            <th>#</th>
                            <th>Código</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Creado por</th>
                            <th>F. Registro</th>
                            <th>Actualizado por</th>
                            <th>F. Actualización</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={9} className="text-center">Cargando...</td>
                            </tr>
                        ) : ciudades.length > 0 ? (
                            ciudades.map((distrito, i) => (
                                <tr key={distrito.id}>
                                    <td>{i + 1}</td>
                                    <td>{distrito.codigo}</td>
                                    <td>{distrito.descripcion}</td>
                                    <td>{distrito.estado}</td>
                                    <td>{distrito.creado_por?.nombre || '—'}</td>
                                    <td>{new Date(distrito.created_at).toLocaleDateString('es-BO')}</td>
                                    <td>{distrito.actualizado_por?.nombre || '—'}</td>
                                    <td>{distrito.updated_at ? new Date(distrito.updated_at).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/distritos/editar/${distrito.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${distrito.estado === 'ACTIVO' ? 'btn-secondary' : 'btn-success'}`}
                                            onClick={() => cambiarEstado(distrito.id)}
                                            title={distrito.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
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

export default Distritos;
