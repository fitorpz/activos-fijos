import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface Cargo {
    codigo: string;
    descripcion: string;
    estado: 'ACTIVO' | 'INACTIVO';
}

const EditarCargos = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<Cargo>({
        codigo: '',
        descripcion: '',
        estado: 'ACTIVO',
    });

    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerCargo();
    }, []);

    const obtenerCargo = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get<Cargo>(`/parametros/cargos/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setFormData({
                codigo: res.data.codigo,
                descripcion: res.data.descripcion,
                estado: res.data.estado,
            });

            setCargando(false);
        } catch (error) {
            console.error('❌ Error al obtener cargo:', error);
            alert('Ocurrió un error al obtener los datos del cargo.');
            navigate('/parametros/cargos');
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`/parametros/cargos/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('✅ Cargo actualizado correctamente');
            navigate('/parametros/cargos');
        } catch (error) {
            console.error('❌ Error al actualizar cargo:', error);
            alert('Ocurrió un error al actualizar el cargo.');
        }
    };

    if (cargando) {
        return <div className="container mt-4">Cargando...</div>;
    }

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Editar Cargo</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="codigo" className="form-label">Código</label>
                            <input
                                type="text"
                                className="form-control"
                                id="codigo"
                                name="codigo"
                                value={formData.codigo}
                                disabled
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                            <input
                                type="text"
                                className="form-control"
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="estado" className="form-label">Estado</label>
                            <select
                                id="estado"
                                name="estado"
                                className="form-select"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                            >
                                <option value="ACTIVO">ACTIVO</option>
                                <option value="INACTIVO">INACTIVO</option>
                            </select>
                        </div>

                        <div className="d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">
                                <i className="bi bi-save me-2"></i> Guardar Cambios
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={() => navigate('/parametros/cargos')}
                            >
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
