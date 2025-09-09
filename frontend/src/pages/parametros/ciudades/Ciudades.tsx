import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface Usuario {
    id: number;
    nombre: string;
    rol: string;
    correo: string;
}

interface Ciudad {
    id: number;
    codigo: string;
    descripcion: string;
    estado: 'ACTIVO' | 'INACTIVO';
    creado_por: Usuario;
    actualizado_por?: Usuario;
    created_at: string;
    updated_at?: string;
}

const Ciudades = () => {
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerCiudades();
    }, [estadoFiltro]);

    const obtenerCiudades = async () => {
        setCargando(true);
        try {
            const res = await axios.get<Ciudad[]>('/parametros/ciudades', {
                params: {
                    estado:
                        estadoFiltro === 'activos'
                            ? 'ACTIVO'
                            : estadoFiltro === 'inactivos'
                                ? 'INACTIVO'
                                : 'todos',
                },
            });
            setCiudades(res.data);
        } catch (error) {
            console.error('❌ Error al obtener ciudades:', error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id: number) => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de esta ciudad?')) return;
        try {
            await axios.put(`/parametros/ciudades/${id}/cambiar-estado`);
            obtenerCiudades();
        } catch (error) {
            console.error('❌ Error al cambiar estado:', error);
        }
    };

    const exportarPDF = async () => {
        const estado = estadoFiltro === 'activos' ? 'ACTIVO' : estadoFiltro === 'inactivos' ? 'INACTIVO' : 'todos';
        try {
            const res = await axios.get<Blob>(`/parametros/ciudades/exportar/pdf?estado=${estado}`, {
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
                    <h4 className="mb-0">Ciudades</h4>
                    <p className="text-muted small">Gestión de ciudades registradas</p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    <button className="btn btn-primary" onClick={() => navigate('/parametros/ciudades/nuevo')}>
                        <i className="bi bi-plus-lg me-1"></i> Nueva Ciudad
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
                            ciudades.map((ciudad, i) => (
                                <tr key={ciudad.id}>
                                    <td>{i + 1}</td>
                                    <td>{ciudad.codigo}</td>
                                    <td>{ciudad.descripcion}</td>
                                    <td>{ciudad.estado}</td>
                                    <td>{ciudad.creado_por?.nombre || '—'}</td>
                                    <td>{new Date(ciudad.created_at).toLocaleDateString('es-BO')}</td>
                                    <td>{ciudad.actualizado_por?.nombre || '—'}</td>
                                    <td>{ciudad.updated_at ? new Date(ciudad.updated_at).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/ciudades/editar/${ciudad.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${ciudad.estado === 'ACTIVO' ? 'btn-secondary' : 'btn-success'}`}
                                            onClick={() => cambiarEstado(ciudad.id)}
                                            title={ciudad.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
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

export default Ciudades;
