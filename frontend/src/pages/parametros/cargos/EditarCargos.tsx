import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface CargoData {
    area: string;
    unidad_organizacional: string;
    ambiente: string;
    codigo: string;
    cargo: string;
    estado: 'ACTIVO' | 'INACTIVO';
}

const EditarCargos = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<CargoData>({
        area: '',
        unidad_organizacional: '',
        ambiente: '',
        codigo: '',
        cargo: '',
        estado: 'ACTIVO',
    });

    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [mensajeError, setMensajeError] = useState<string | null>(null);

    const authHeaders = () => {
        const token = localStorage.getItem('token');
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        const cargarCargo = async () => {
            try {
                const res = await axios.get<CargoData>(`/parametros/cargos/${id}`, {
                    headers: authHeaders(),
                });

                setFormData({
                    area: res.data.area,
                    unidad_organizacional: res.data.unidad_organizacional,
                    ambiente: res.data.ambiente,
                    codigo: res.data.codigo,
                    cargo: res.data.cargo,
                    estado: res.data.estado || 'ACTIVO',
                });
            } catch (error) {
                console.error('Error al cargar cargo:', error);
                setMensajeError('No se pudo cargar el cargo.');
            } finally {
                setCargando(false);
            }
        };

        cargarCargo();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGuardando(true);
        setMensajeError(null);

        try {
            await axios.put(
                `/parametros/cargos/${id}`,
                {
                    cargo: formData.cargo,
                    estado: formData.estado,
                },
                { headers: authHeaders() }
            );

            alert('✅ Cargo actualizado correctamente');
            navigate('/parametros/cargos');
        } catch (error) {
            console.error('Error al actualizar cargo:', error);
            setMensajeError('Ocurrió un error al actualizar el cargo.');
        } finally {
            setGuardando(false);
        }
    };

    if (cargando) {
        return <div className="container mt-4">Cargando datos...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">Editar Cargo</h5>
                </div>

                <div className="card-body">
                    {mensajeError && <div className="alert alert-danger">{mensajeError}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Campos no editables */}
                        <div className="mb-3">
                            <label className="form-label">Área</label>
                            <input type="text" className="form-control" value={formData.area} disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Unidad Organizacional</label>
                            <input type="text" className="form-control" value={formData.unidad_organizacional} disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Ambiente</label>
                            <input type="text" className="form-control" value={formData.ambiente} disabled />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Código</label>
                            <input type="text" className="form-control" value={formData.codigo} disabled />
                        </div>

                        {/* Campos editables */}
                        <div className="mb-3">
                            <label className="form-label">Descripción / Cargo</label>
                            <input
                                type="text"
                                className="form-control"
                                name="cargo"
                                value={formData.cargo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Estado</label>
                            <select
                                className="form-select"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                            >
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="INACTIVO">INACTIVO</option>
                            </select>
                        </div>

                        {/* Botones */}
                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary" disabled={guardando}>
                                {guardando ? 'Guardando...' : 'Guardar'}
                            </button>
                            <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/parametros/cargos')}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarCargos;
