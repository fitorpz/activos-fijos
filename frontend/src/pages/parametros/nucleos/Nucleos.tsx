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
    const [nucleosFiltrados, setNucleosFiltrados] = useState<Nucleo[]>([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    const [estadoFiltro, setEstadoFiltro] = useState<'todos' | 'activos' | 'inactivos'>('activos');
    const [filtroCodigo, setFiltroCodigo] = useState('');
    const [filtroDescripcion, setFiltroDescripcion] = useState('');
    const [filtroEstado, setFiltroEstado] = useState<'TODOS' | 'ACTIVO' | 'INACTIVO'>('TODOS');
    const [filtroCreadoPor, setFiltroCreadoPor] = useState('');
    const [filtroActualizadoPor, setFiltroActualizadoPor] = useState('');

    useEffect(() => {
        obtenerNucleos();
    }, [estadoFiltro]);

    useEffect(() => {
        aplicarFiltros();
    }, [
        filtroCodigo,
        filtroDescripcion,
        filtroEstado,
        filtroCreadoPor,
        filtroActualizadoPor,
        nucleos
    ]);


    useEffect(() => {
        switch (estadoFiltro) {
            case 'activos':
                setFiltroEstado('ACTIVO');
                break;
            case 'inactivos':
                setFiltroEstado('INACTIVO');
                break;
            default:
                setFiltroEstado('TODOS');
        }
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
            const res = await axios.get<Blob>(`/parametros/nucleos/exportar/pdf?estado=${estado}`, {
                responseType: 'blob',
            });

            const blob = new Blob([res.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('❌ Error al exportar PDF:', error);
        }
    };

    const aplicarFiltros = () => {
        let filtrado = nucleos;

        if (filtroEstado !== 'TODOS') {
            filtrado = filtrado.filter((nucleo) => nucleo.estado === filtroEstado);
        }

        if (filtroCodigo.trim() !== '') {
            filtrado = filtrado.filter((nucleo) =>
                nucleo.codigo.toLowerCase().includes(filtroCodigo.toLowerCase())
            );
        }

        if (filtroDescripcion.trim() !== '') {
            filtrado = filtrado.filter((nucleo) =>
                nucleo.descripcion.toLowerCase().includes(filtroDescripcion.toLowerCase())
            );
        }

        if (filtroCreadoPor.trim() !== '') {
            filtrado = filtrado.filter((nucleo) =>
                nucleo.creado_por?.nombre.toLowerCase().includes(filtroCreadoPor.toLowerCase())
            );
        }

        if (filtroActualizadoPor.trim() !== '') {
            filtrado = filtrado.filter((nucleo) =>
                nucleo.actualizado_por?.nombre.toLowerCase().includes(filtroActualizadoPor.toLowerCase())
            );
        }

        // ✅ Ordenar alfabéticamente por código
        filtrado.sort((a, b) => a.codigo.localeCompare(b.codigo));

        setNucleosFiltrados(filtrado);
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
                            onChange={(e) => setEstadoFiltro(e.target.value as 'todos' | 'activos' | 'inactivos')}
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

                        {/* FILTRADORES DENTRO DEL THEAD */}
                        <tr>
                            <th></th>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Filtrar código"
                                    className="form-control form-control-sm"
                                    value={filtroCodigo}
                                    onChange={(e) => setFiltroCodigo(e.target.value)}
                                />
                            </th>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Filtrar descripción"
                                    className="form-control form-control-sm"
                                    value={filtroDescripcion}
                                    onChange={(e) => setFiltroDescripcion(e.target.value)}
                                />
                            </th>
                            <th>
                                <select
                                    className="form-select form-select-sm"
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value as 'TODOS' | 'ACTIVO' | 'INACTIVO')}
                                >
                                    <option value="TODOS">Todos</option>
                                    <option value="ACTIVO">Activo</option>
                                    <option value="INACTIVO">Inactivo</option>
                                </select>
                            </th>
                            <th>
                                <input
                                    type="text"
                                    placeholder="Filtrar creado por"
                                    className="form-control form-control-sm"
                                    value={filtroCreadoPor}
                                    onChange={(e) => setFiltroCreadoPor(e.target.value)}
                                />
                            </th>
                            <th></th> {/* para F. Registro no se filtra */}
                            <th>
                                <input
                                    type="text"
                                    placeholder="Filtrar actualizado por"
                                    className="form-control form-control-sm"
                                    value={filtroActualizadoPor}
                                    onChange={(e) => setFiltroActualizadoPor(e.target.value)}
                                />
                            </th>
                            <th></th> {/* para F. Actualización no se filtra */}
                            <th></th> {/* para acciones */}

                        </tr>
                    </thead>

                    <tbody>
                        {cargando ? (
                            <tr>
                                <td colSpan={9} className="text-center">
                                    Cargando...
                                </td>
                            </tr>
                        ) : nucleosFiltrados.length > 0 ? (
                            nucleosFiltrados.map((nucleo, i) => (
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
                                <td colSpan={9} className="text-center">
                                    No hay registros.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Nucleos;