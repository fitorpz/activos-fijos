import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig'; // Ajusta ruta según tu estructura

export interface Usuario {
  id: number;
  nombre: string;
  // puedes incluir otros campos si los necesitas
}
interface Edificio {
    id_311: number;
    codigo_311: string;
    ingreso_311: string;
    ingreso_des_311: string;
    clasificacion_311: string;
    uso_actual_311: string;
    fecha_alta_311: string;
    creadoPor?: Usuario;
    actualizadoPor?: Usuario;
    fecha_creacion?: string;
    fecha_actualizacion?: string;
}



const ListaEdificios = () => {
    const [edificioSeleccionado, setEdificioSeleccionado] = useState<Edificio | null>(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [edificios, setEdificios] = useState<Edificio[]>([]);
    const navigate = useNavigate();

    const abrirModal = (edificio: Edificio) => {
        setEdificioSeleccionado(edificio);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setEdificioSeleccionado(null);
    };

    useEffect(() => {
        obtenerEdificios();
    }, []);

    const obtenerEdificios = async () => {
        try {
            const res = await axios.get('http://localhost:3001/edificios');
            const data = res.data as { data: Edificio[] }; // 👈 casting
            setEdificios(data.data);

        } catch (error) {
            console.error('Error al obtener edificios:', error);
        }
    };

    const eliminarEdificio = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este edificio?')) return;
        try {
            await axios.delete(`http://localhost:3001/edificios/${id}`);
            obtenerEdificios();
        } catch (error) {
            console.error('Error al eliminar edificio:', error);
        }
    };

    return (
        <div className="container">
            <h2 className="my-4">Lista de Edificios</h2>
            <button className="btn btn-primary mb-3" onClick={() => navigate('/edificios/nuevo')}>
                + Nuevo Edificio
            </button>

            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Código</th>
                            <th>Fecha de Alta</th>
                            <th>Ingreso</th>
                            <th>Clasificación</th>
                            <th>Uso Actual</th>
                            <th>Creado por</th>
                            <th>Fecha Creación</th>
                            <th>Modificado por</th>
                            <th>Fecha Modificación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {edificios.length > 0 ? (
                            edificios.map((edificio, index) => (
                                <tr key={edificio.id_311}>
                                    <td>{index + 1}</td> {/* Número correlativo */}
                                    <td>{edificio.codigo_311 || '—'}</td>
                                    <td>{edificio.fecha_alta_311 ? new Date(edificio.fecha_alta_311).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>{(edificio.ingreso_311 || '—') + ' - ' + (edificio.ingreso_des_311 || '—')}</td>
                                    <td>{edificio.clasificacion_311 || 'Sin clasificar'}</td>
                                    <td>{edificio.uso_actual_311 || 'N/D'}</td>
                                    <td>{edificio.creadoPor?.nombre || '—'}</td>
                                    <td>{edificio.fecha_creacion ? new Date(edificio.fecha_creacion).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>{edificio.actualizadoPor?.nombre || '—'}</td>
                                    <td>{edificio.fecha_actualizacion ? new Date(edificio.fecha_actualizacion).toLocaleDateString('es-BO') : '—'}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            onClick={() => navigate(`/edificios/editar/${edificio.id_311}`)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger me-2"
                                            onClick={() => eliminarEdificio(edificio.id_311)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => abrirModal(edificio)}
                                        >
                                            Ver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={10} className="text-center">
                                    No hay edificios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {mostrarModal && edificioSeleccionado && (
                <div className="modal show d-block" tabIndex={-1} role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Detalles del Edificio</h5>
                                <button type="button" className="btn-close" onClick={cerrarModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {Object.entries(edificioSeleccionado).map(([key, value]) => (
                                        <div className="col-md-6 mb-2" key={key}>
                                            <strong>{key}:</strong> <br />
                                            <span>{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListaEdificios;
