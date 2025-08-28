import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface Area {
    id: number;
    descripcion: string;
}

const RegistroUnidadesOrganizacionales = () => {
    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: '',
        area_id: '',
    });

    const [areas, setAreas] = useState<Area[]>([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        obtenerAreas();
    }, []);

    const obtenerAreas = async () => {
        try {
            const res = await axios.get<Area[]>('/parametros/areas'); // ✅ sin ?estado=activos
            setAreas(res.data);
        } catch (err) {
            console.error('❌ Error al obtener áreas:', err);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.codigo || !formData.descripcion || !formData.area_id) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        try {
            await axios.post('/parametros/unidades-organizacionales', {
                codigo: formData.codigo.trim(),
                descripcion: formData.descripcion.trim(),
                area_id: parseInt(formData.area_id),
            });
            navigate('/parametros/unidades-organizacionales');
        } catch (err: any) {
            console.error('❌ Error al registrar unidad organizacional:', err);
            setError('Error al registrar. Intenta nuevamente.');
        }
    };

    return (
        <div className="container mt-4">
            <h4 className="mb-3">Registrar Unidad Organizacional</h4>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label htmlFor="codigo" className="form-label">Código</label>
                    <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        className="form-control"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="area_id" className="form-label">Área</label>
                    <select
                        id="area_id"
                        name="area_id"
                        className="form-select"
                        value={formData.area_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Seleccione un área</option>
                        {areas.map(area => (
                            <option key={area.id} value={area.id}>
                                {area.descripcion}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">
                        <i className="bi bi-save me-2"></i>Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistroUnidadesOrganizacionales;
