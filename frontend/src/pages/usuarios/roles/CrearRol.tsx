import React, { useEffect, useState } from 'react';
import { listarPermisos, crearRol } from '../../../api/roles';
import { Permiso } from '../../../interfaces/interfaces';
import { useNavigate } from 'react-router-dom';

export const CrearRol = () => {
    const [nombre, setNombre] = useState('');
    const [slug, setSlug] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [permisos, setPermisos] = useState<number[]>([]);
    const [listaPermisos, setListaPermisos] = useState<Permiso[]>([]);
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();

    // Cargar permisos y seleccionar todos por defecto si existen
    useEffect(() => {
        setCargando(true);
        listarPermisos()
            .then(res => {
                const lista = res.data?.data || [];
                setListaPermisos(lista);
                if (lista.length > 0) setPermisos(lista.map(p => p.id));
            })
            .catch(() => {
                setListaPermisos([]);
                setPermisos([]);
            })
            .then(() => setCargando(false)); // ← Esto SÍ funciona en todas las promesas estándar
    }, []);


    const handlePermisosChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, opt => Number(opt.value));
        setPermisos(selectedOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await crearRol({ nombre, slug, descripcion, permisos });
            alert('Rol creado correctamente');
            navigate('/usuarios/roles');
        } catch (err: any) {
            alert('Error al crear rol: ' + (err.message || 'Error desconocido'));
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h4 className="mb-4 text-center">Crear Rol</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            className="form-control"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            required
                            placeholder="Ejemplo: Administrador"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Slug</label>
                        <input
                            className="form-control"
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            required
                            placeholder="Ejemplo: admin"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Descripción</label>
                        <textarea
                            className="form-control"
                            value={descripcion}
                            onChange={e => setDescripcion(e.target.value)}
                            placeholder="Descripción del rol"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="form-label">Permisos</label>
                        <select
                            className="form-select"
                            multiple
                            value={permisos.map(String)}
                            onChange={handlePermisosChange}
                            required={listaPermisos.length > 0}
                            disabled={cargando || listaPermisos.length === 0}
                        >
                            {listaPermisos.length === 0 ? (
                                <option value="" disabled>
                                    {cargando ? "Cargando permisos..." : "No hay permisos disponibles"}
                                </option>
                            ) : (
                                listaPermisos.map(permiso => (
                                    <option key={permiso.id} value={permiso.id}>
                                        {permiso.nombre} {permiso.descripcion ? `(${permiso.descripcion})` : ''}
                                    </option>
                                ))
                            )}
                        </select>
                        <small className="text-muted">
                            {listaPermisos.length === 0
                                ? "Por ahora este rol tendrá acceso total."
                                : "Mantén seleccionados todos los permisos para acceso total."}
                        </small>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-success" disabled={cargando}>
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearRol;
