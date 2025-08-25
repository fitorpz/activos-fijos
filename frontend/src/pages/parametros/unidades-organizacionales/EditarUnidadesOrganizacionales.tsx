import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../../utils/axiosConfig';

interface UnidadOrganizacional {
    id: number;
    codigo: string;
    descripcion: string;
    area: string;
}

const EditarUnidadesOrganizacionales = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        codigo: '',
        descripcion: '',
        area: '',
    });

    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerUnidad();
    }, []);

    const obtenerUnidad = async () => {
        try {
            const res = await axios.get<UnidadOrganizacional>(`/parametros/unidades-organizacionales/${id}`);
            setFormData({
                codigo: res.data.codigo || '',
                descripcion: res.data.descripcion || '',
                area: res.data.area || '',
            });
        } catch (error) {
            console.error('❌ Error al cargar la unidad organizacional:', error);
            alert('Error al cargar la unidad. Intente nuevamente.');
            navigate('/parametros/unidades-organizacionales');
        } finally {
            setCargando(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                codigo: formData.codigo.trim(),
                descripcion: formData.descripcion.trim(),
                area: formData.area.trim(),
            };

            await axios.put(`/parametros/unidades-organizacionales/${id}`, payload);
            alert('✅ Unidad actualizada correctamente.');
            navigate('/parametros/unidades-organizacionales');
        } catch (error: any) {
            console.error('❌ Error al actualizar la unidad organizacional:', error);
            alert(error?.response?.data?.message || 'Error al actualizar.');
        }
    };

    return (
        <div className="container mt-4">
            <div className="form-container">
                <h4 className="mb-4">Editar Unidad Organizacional</h4>
                {cargando ? (
                    <p>Cargando datos...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="codigo" className="form-label">Código</label>
                            <input
                                type="text"
                                id="codigo"
                                name="codigo"
                                className="form-control"
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
                            <label htmlFor="area" className="form-label">Área</label>
                            <input
                                type="text"
                                id="area"
                                name="area"
                                className="form-control"
                                value={formData.area}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                        <button
                            type="button"
                            className="btn btn-secondary ms-2"
                            onClick={() => navigate('/parametros/unidades-organizacionales')}
                        >
                            Cancelar
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditarUnidadesOrganizacionales;
