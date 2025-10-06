// src/pages/usuarios/EditarRol.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listarPermisos, editarRol, obtenerRol } from '../../../api/roles';
import { Permiso, Rol } from '../../../interfaces/interfaces';

export const EditarRol = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [slug, setSlug] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [permisos, setPermisos] = useState<number[]>([]);
    const [listaPermisos, setListaPermisos] = useState<Permiso[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            setCargando(true);
            try {
                // 1. Cargar todos los permisos
                const permisosRes = await listarPermisos();
                const permisosAll: Permiso[] = permisosRes.data?.data || permisosRes.data || [];
                setListaPermisos(permisosAll);

                // 2. Cargar datos del rol
                const rolRes = await obtenerRol(Number(id));
                const rol: Rol = rolRes.data?.data || rolRes.data;

                if (!rol) throw new Error('Rol no encontrado');

                setNombre(rol.nombre || '');
                setSlug(rol.slug || '');
                setDescripcion(rol.descripcion || '');

                // Manejo flexible por si los permisos vienen como objetos o ids
                if (Array.isArray(rol.permisos)) {
                    const permisosIds = rol.permisos.map(p =>
                        typeof p === 'object' ? p.id : Number(p)
                    );
                    setPermisos(permisosIds);
                } else {
                    setPermisos([]);
                }

            } catch (error) {
                console.error('Error al cargar datos del rol:', error);
                alert('No se pudieron cargar los datos del rol.');
                setListaPermisos([]);
                setPermisos([]);
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [id]);

    const handlePermisosChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions, opt => Number(opt.value));
        setPermisos(selectedOptions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await editarRol(Number(id), { nombre, slug, descripcion, permisos });
            alert('Rol actualizado correctamente');
            navigate('/usuarios/roles');
        } catch (err: any) {
            alert('Error al actualizar rol: ' + (err?.message || 'Error desconocido'));
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
                <h4 className="mb-4 text-center">Editar Rol</h4>
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
                                : "Selecciona los permisos correspondientes para este rol."}
                        </small>
                    </div>
                    <div className="d-grid">
                        <button type="submit" className="btn btn-primary" disabled={cargando}>
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditarRol;
