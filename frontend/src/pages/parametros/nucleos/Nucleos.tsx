import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface Usuario {
    id: number;
    nombre: string;
    rol: string;
    correo: string;
}

interface Nucleo {
    id: number;
    codigo: string;
    descripcion: string;
    estado: 'ACTIVO' | 'INACTIVO';
    creado_por: Usuario;
    actualizado_por?: Usuario;
    created_at: string;
    updated_at?: string;
}

const Nucleos = () => {
    const [nucleos, setNucleos] = useState<Nucleo[]>([]);
    const [estadoFiltro, setEstadoFiltro] = useState<string>('activos');
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerNucleos();
    }, [estadoFiltro]);

    const obtenerNucleos = async () => {
        setCargando(true);
        try {
            const res = await axios.get<Nucleo[]>('/parametros/nucleos', {
                params: {
                    estado:
                        estadoFiltro === 'activos'
                            ? 'ACTIVO'
                            : estadoFiltro === 'inactivos'
                                ? 'INACTIVO'
                                : 'todos',
                },
            });
            setNucleos(res.data);
        } catch (error) {
            console.error('❌ Error al obtener núcleos:', error);
        } finally {
            setCargando(false);
        }
    };

    const cambiarEstado = async (id: number) => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de este núcleo?')) return;
        try {
            await axios.put(`/parametros/nucleos/${id}/cambiar-estado`);
            obtenerNucleos();
        } catch (error) {
            console.error('❌ Error al cambiar estado:', error);
        }
    };

    const exportarPDF = async () => {
        const estado = estadoFiltro === 'activos' ? 'ACTIVO' : estadoFiltro === 'inactivos' ? 'INACTIVO' : 'todos';

        try {
            const res = await axios.get<Blob>(
                `/parametros/nucleos/exportar/pdf?estado=${estado}`,
                {
                    responseType: 'blob',
                }
            );


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
                    <h4 className="mb-0">Núcleos</h4>
                    <p className="text-muted small">Gestión de registros por núcleo organizacional</p>
                </div>

                <div className="d-flex flex-wrap align-items-center gap-2">
                    <button className="btn btn-primary" onClick={() => navigate('/parametros/nucleos/nuevo')}>
                        <i className="bi bi-plus-lg me-1"></i> Nuevo Núcleo
                    </button>

                    <button className="btn btn-outline-success" onClick={exportarPDF}>
                        <i className="bi bi-file-earmark-pdf me-1"></i> Exportar PDF
                    </button>

                    <button className="btn btn-outline-secondary" onClick={() => navigate('/parametros')}>
                        <i className="bi bi-arrow-left me-1"></i> Volver a Parámetros
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
                        ) : nucleos.length > 0 ? (
                            nucleos.map((nucleo, i) => (
                                <tr key={nucleo.id}>
                                    <td>{i + 1}</td>
                                    <td>{nucleo.codigo}</td>
                                    <td>{nucleo.descripcion}</td>
                                    <td>{nucleo.estado}</td>
                                    <td>{nucleo.creado_por?.nombre || '—'}</td>
                                    <td>{new Date(nucleo.created_at).toLocaleDateString('es-BO')}</td>
                                    <td>{nucleo.actualizado_por?.nombre || '—'}</td>
                                    <td>{nucleo.updated_at ? new Date(nucleo.updated_at).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/parametros/nucleos/editar/${nucleo.id}`)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${nucleo.estado === 'ACTIVO' ? 'btn-secondary' : 'btn-success'}`}
                                            onClick={() => cambiarEstado(nucleo.id)}
                                            title={nucleo.estado === 'ACTIVO' ? 'Inactivar' : 'Activar'}
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

export default Nucleos;
