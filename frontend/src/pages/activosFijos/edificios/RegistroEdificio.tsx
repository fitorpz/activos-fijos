// RegistroEdificio.tsx
import { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../styles/form-styles.css';
import axiosInstance from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';


interface Area {
    id: number;
    codigo: string;
    descripcion: string;
}

interface UnidadOrganizacional {
    id: number;
    codigo: string;
    descripcion: string;
}

interface Ambiente {
    id: number;
    codigo: string;
    descripcion: string;
}

interface Cargo {
    id: number;
    codigo: string;
    cargo: string;
    descripcion: string;
}

interface FormDataEdificio {
    descripcion_edificio: string;
    area_id: string;
    unidad_organizacional_id: string;
    unidad_organizacional: string;
    ambiente_id: string;
    ambiente: string;
    cargo: string;
    cargo_id: string | number;

    codigo_311: string;
    ingreso_311: string;
    ingreso_des_311: string;
    fecha_alta_311: string;
    proveedor_311: string;
    fecha_factura_311: string;
    num_factura_311: string;
    observaciones_311: string;
    estado_conservacion_311: string;
    valor_311: string;
    vida_util_311: string;
    fecha_estado_311: string;
    descripcion_estado_311: string;
    estado_311: string;
    estado_faltante_311: string;

    id_per: string;
    tdi_per: string;
    ndi_per: string;
    expedido_per: string;
    nombre_per: string;
    ap_paterno_per: string;
    ap_materno_per: string;
    ap_conyuge_per: string;
    sexo_per: string;
    f_nacimiento_per: string;
    c_civil_per: string;
    profesion_per: string;
    direccion_per: string;
    telefono_per: string;
    celular_per: string;
    email_per: string;
    estado_per: string;

    id_clasi_2: string;
    codigo_clasi: string;
    nombre_clasi: string;
    descripcion_clasi: string;
    id_sg_clasi: string;
    nombre_sg_clasi: string;

    id_func: string;
    tipo_func: string;
    num_file: string;
    item_func: string;
    telefono_func: string;
    interno_func: string;
    estado_func: string;

    id_cargo_func: string;
    id_ubi_func: string;
    id_act_func: string;
    id_cargo: string;
    codigo_cargo: string;
    nombre_cargo: string;
    descripcion_cargo: string;
    estado_cargo: string;
    id_af_cargo: string;

    id_ubi: string;
    codigo_ubi: string;
    nombre_ubi: string;
    direccion_ubi: string;
    distrito_ubi: string;
    observaciones_ubi: string;
    estado_ubi: string;

    id_af: string;
    codigo_af: string;
    nombre_af: string;
    estado_af: string;

    // Opcionales
    creado_por_id?: number;
    actualizado_por_id?: number;
}



const RegistroEdificio = () => {
    const [formData, setFormData] = useState<FormDataEdificio>({
        descripcion_edificio: '',
        area_id: '',
        unidad_organizacional_id: '',
        unidad_organizacional: '',
        ambiente_id: '',
        ambiente: '',
        cargo: '',
        cargo_id: '',
        codigo_311: '',
        ingreso_311: '',
        ingreso_des_311: '',
        fecha_alta_311: '',
        proveedor_311: '',
        fecha_factura_311: '',
        num_factura_311: '',
        observaciones_311: '',
        estado_conservacion_311: '',
        valor_311: '',
        vida_util_311: '',
        fecha_estado_311: '',
        descripcion_estado_311: '',
        estado_311: '',
        estado_faltante_311: '',
        id_per: '',
        tdi_per: '',
        ndi_per: '',
        expedido_per: '',
        nombre_per: '',
        ap_paterno_per: '',
        ap_materno_per: '',
        ap_conyuge_per: '',
        sexo_per: '',
        f_nacimiento_per: '',
        c_civil_per: '',
        profesion_per: '',
        direccion_per: '',
        telefono_per: '',
        celular_per: '',
        email_per: '',
        estado_per: '',
        id_clasi_2: '',
        codigo_clasi: '',
        nombre_clasi: '',
        descripcion_clasi: '',
        id_sg_clasi: '',
        nombre_sg_clasi: '',
        id_func: '',
        tipo_func: '',
        num_file: '',
        item_func: '',
        telefono_func: '',
        interno_func: '',
        estado_func: '',
        id_cargo_func: '',
        id_ubi_func: '',
        id_act_func: '',
        id_cargo: '',
        codigo_cargo: '',
        nombre_cargo: '',
        descripcion_cargo: '',
        estado_cargo: '',
        id_af_cargo: '',
        id_ubi: '',
        codigo_ubi: '',
        nombre_ubi: '',
        direccion_ubi: '',
        distrito_ubi: '',
        observaciones_ubi: '',
        estado_ubi: '',
        id_af: '',
        codigo_af: '',
        nombre_af: '',
        estado_af: ''
    });


    const [areas, setAreas] = useState<Area[]>([]);
    const [unidadInput, setUnidadInput] = useState('');
    const [sugerenciasUnidad, setSugerenciasUnidad] = useState<UnidadOrganizacional[]>([]);
    const [ambienteInput, setAmbienteInput] = useState('');
    const [sugerenciasAmbientes, setSugerenciasAmbientes] = useState<Ambiente[]>([]);
    const [sugerenciasCargos, setSugerenciasCargos] = useState<Cargo[]>([]);
    const [buscarCargo, setBuscarCargo] = useState('');
    const [cargoInput, setCargoInput] = useState('');
    const [inputCargo, setInputCargo] = useState('');

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (inputCargo.length > 0 && formData.ambiente_id) {
                buscarCargos(Number(formData.ambiente_id), inputCargo);
            } else {
                setSugerenciasCargos([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [inputCargo, formData.ambiente_id]);



    useEffect(() => {
        const fetchCargos = async () => {
            if (buscarCargo.length < 2 || !formData.ambiente_id) {
                setSugerenciasCargos([]);
                return;
            }

            try {
                const res = await axiosInstance.get<Cargo[]>('/parametros/cargos/buscar-por-ambiente', {
                    params: {
                        ambiente_id: formData.ambiente_id,
                        q: buscarCargo, // texto ingresado
                    },
                });

                setSugerenciasCargos(res.data);
            } catch (error) {
                console.error('❌ Error al buscar cargos:', error);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchCargos();
        }, 300); // pequeño delay para no hacer llamada por cada tecla

        return () => clearTimeout(delayDebounce);
    }, [buscarCargo, formData.ambiente_id]);

    // Cargar áreas al inicio
    useEffect(() => {
        const obtenerAreas = async () => {
            try {
                const res = await axiosInstance.get<Area[]>('/parametros/areas');
                setAreas(res.data);
            } catch (error) {
                console.error('Error al obtener áreas:', error);
            }
        };

        obtenerAreas();
    }, []);



    const buscarUnidades = async (texto: string) => {
        try {
            if (!formData.area_id) return;
            const res = await axiosInstance.get<UnidadOrganizacional[]>(
                '/parametros/unidades-organizacionales/buscar',
                {
                    params: {
                        q: texto,
                        estado: 'ACTIVO',
                        area_id: formData.area_id
                    }
                }
            );
            setSugerenciasUnidad(res.data);
        } catch (error) {
            console.error('Error al buscar unidades:', error);
        }
    };

    const buscarAmbientes = async (unidadOrganizacionalId: number, search: string) => {
        try {
            if (!search || search.trim() === '') {
                setSugerenciasAmbientes([]); // limpia sugerencias
                return;
            }

            const token = localStorage.getItem('token');
            const res = await axiosInstance.get<Ambiente[]>('/parametros/ambientes/buscar', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    unidad_organizacional_id: unidadOrganizacionalId,
                    search: search.trim()
                }
            });

            setSugerenciasAmbientes(res.data);

        } catch (error) {
            console.error('Error al buscar ambientes:', error);
        }
    };

    const buscarCargos = async (ambienteId: number, termino: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.get<Cargo[]>('/parametros/cargos/buscar', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    ambiente_id: ambienteId,
                    search: termino
                }
            });


            setSugerenciasCargos(response.data);
        } catch (error) {
            console.error('Error al buscar cargos:', error);
        }
    };




    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const payload = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v !== '' && v !== null)
            );

            const response = await axiosInstance.post('/edificios', payload);

            alert('✅ Edificio registrado correctamente');
            console.log('Respuesta:', response.data);
            navigate('/edificios');
        } catch (error: any) {
            console.error('❌ Error al guardar el edificio:', error);
            if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('Error desconocido al registrar edificio.');
            }
        }
    };

    const seleccionarCargo = (cargo: Cargo) => {
        setFormData(prev => ({
            ...prev,
            cargo: `${cargo.codigo} - ${cargo.cargo}`,
            cargo_id: cargo.id
        }));
        setCargoInput(`${cargo.codigo} - ${cargo.cargo}`);
        setInputCargo(`${cargo.codigo} - ${cargo.cargo}`);
        setSugerenciasCargos([]);
    };




    return (
        <div className="container mt-4">
            <div className="form-container">
                <h2 className="mb-4">Registro de Edificio</h2>
                <form onSubmit={handleSubmit}>
                    <Tabs defaultActiveKey="datos" id="registro-edificio-tabs" className="mb-3" fill>

                        {/* Sección 1: Datos Iniciales del Bien */}
                        <Tab eventKey="datos" title="Datos Iniciales del Bien">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="descripcion_edificio" className="form-label">Descripción del Edificio</label>
                                    <textarea
                                        className="form-control"
                                        id="descripcion_edificio"
                                        name="descripcion_edificio"
                                        rows={2}
                                        value={formData.descripcion_edificio || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="area_id" className="form-label">Área</label>
                                    <select
                                        className="form-select"
                                        id="area_id"
                                        name="area_id"
                                        value={formData.area_id || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Seleccione un área</option>
                                        {areas.map((area) => (
                                            <option key={area.id} value={area.id}>
                                                {area.codigo} - {area.descripcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="unidad_organizacional_id" className="form-label">Unidad Organizacional</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="unidad_organizacional_input"
                                        placeholder="Buscar unidad..."
                                        value={unidadInput}
                                        onChange={(e) => {
                                            const texto = e.target.value;
                                            setUnidadInput(texto);
                                            buscarUnidades(texto);
                                        }}
                                    />

                                    {sugerenciasUnidad.length > 0 && (
                                        <ul className="list-group position-absolute w-100 z-3" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                            {sugerenciasUnidad.map((unidad) => (
                                                <li
                                                    key={unidad.id}
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => {
                                                        setFormData((prev: any) => ({
                                                            ...prev,
                                                            unidad_organizacional_id: unidad.id,
                                                            unidad_organizacional: unidad.descripcion,
                                                        }));
                                                        setUnidadInput(`${unidad.codigo} - ${unidad.descripcion}`);
                                                        setSugerenciasUnidad([]);
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {unidad.codigo} - {unidad.descripcion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="ambiente" className="form-label">Ambiente</label>
                                    <input
                                        type="text"
                                        id="ambiente"
                                        name="ambiente"
                                        className="form-control"
                                        value={ambienteInput}
                                        onChange={(e) => {
                                            const texto = e.target.value;
                                            setAmbienteInput(texto);
                                            buscarAmbientes(parseInt(formData.unidad_organizacional_id), texto);
                                        }}
                                        autoComplete="off"
                                        placeholder="Buscar por código o descripción..."
                                    />
                                    {sugerenciasAmbientes.length > 0 && (
                                        <ul className="list-group position-absolute w-100 z-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {sugerenciasAmbientes.map((ambiente) => (
                                                <li
                                                    key={ambiente.id}
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => {
                                                        setFormData((prev: typeof formData) => ({
                                                            ...prev,
                                                            ambiente_id: `${ambiente.id}`, // 👈 convertimos a string
                                                            ambiente: ambiente.descripcion,
                                                        }));



                                                        setAmbienteInput(`${ambiente.codigo} - ${ambiente.descripcion}`);
                                                        setSugerenciasAmbientes([]);
                                                    }}
                                                >
                                                    {ambiente.codigo} - {ambiente.descripcion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="cargo" className="form-label">Cargo</label>
                                    <input
                                        type="text"
                                        id="cargo"
                                        className="form-control"
                                        value={inputCargo}
                                        onChange={(e) => setInputCargo(e.target.value)}
                                        placeholder="Buscar cargo por descripción..."
                                        autoComplete="off"
                                    />

                                    {sugerenciasCargos.length > 0 && (
                                        <ul className="list-group mt-1" style={{ maxHeight: '150px', overflowY: 'auto', position: 'absolute', zIndex: 1000 }}>
                                            {sugerenciasCargos.map((cargo) => (
                                                <li
                                                    key={cargo.id}
                                                    className="list-group-item list-group-item-action"
                                                    onClick={() => seleccionarCargo(cargo)}
                                                >
                                                    {cargo.codigo} - {cargo.descripcion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>





                                <input type="hidden" name="cargo_id" value={formData.cargo_id || ''} />


                                <input
                                    type="hidden"
                                    name="ambiente_id"
                                    value={formData.ambiente_id || ''}
                                />

                                <input
                                    type="hidden"
                                    name="unidad_organizacional_id"
                                    value={formData.unidad_organizacional_id || ''}
                                />

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="codigo_311" className="form-label">Código del Edificio</label>
                                    <input type="text" className="form-control" id="codigo_311" name="codigo_311" value={formData.codigo_311 || ''} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="ingreso_311" className="form-label">Tipo de Ingreso</label>
                                    <input type="text" className="form-control" id="ingreso_311" name="ingreso_311" value={formData.ingreso_311 || ''} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="ingreso_des_311" className="form-label">Descripción del Ingreso</label>
                                    <input type="text" className="form-control" id="ingreso_des_311" name="ingreso_des_311" value={formData.ingreso_des_311 || ''} onChange={handleChange} required />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fecha_alta_311" className="form-label">Fecha de Alta</label>
                                    <input type="date" className="form-control" id="fecha_alta_311" name="fecha_alta_311" value={formData.fecha_alta_311 || ''} onChange={handleChange} required />
                                </div>
                            </div>
                        </Tab>

                        {/* Secciones siguientes (a completar posteriormente) */}
                        <Tab eventKey="legal" title="Información Legal y de Compra">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="proveedor_311" className="form-label">Proveedor</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="proveedor_311"
                                        name="proveedor_311"
                                        value={formData.proveedor_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fecha_factura_311" className="form-label">Fecha de Factura</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_factura_311"
                                        name="fecha_factura_311"
                                        value={formData.fecha_factura_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="num_factura_311" className="form-label">Número de Factura</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="num_factura_311"
                                        name="num_factura_311"
                                        value={formData.num_factura_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="observaciones_311" className="form-label">Observaciones</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="observaciones_311"
                                        name="observaciones_311"
                                        value={formData.observaciones_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Tab>


                        <Tab eventKey="estado" title="Estado del Bien">
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="estado_conservacion_311" className="form-label">Estado de Conservación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="estado_conservacion_311"
                                        name="estado_conservacion_311"
                                        value={formData.estado_conservacion_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="valor_311" className="form-label">Valor</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        id="valor_311"
                                        name="valor_311"
                                        value={formData.valor_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="vida_util_311" className="form-label">Vida Útil (en años)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="vida_util_311"
                                        name="vida_util_311"
                                        value={formData.vida_util_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="fecha_estado_311" className="form-label">Fecha de Estado</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="fecha_estado_311"
                                        name="fecha_estado_311"
                                        value={formData.fecha_estado_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="descripcion_estado_311" className="form-label">Descripción del Estado</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="descripcion_estado_311"
                                        name="descripcion_estado_311"
                                        value={formData.descripcion_estado_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="estado_311" className="form-label">Estado Actual</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="estado_311"
                                        name="estado_311"
                                        value={formData.estado_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="estado_faltante_311" className="form-label">Fecha Faltante (si aplica)</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="estado_faltante_311"
                                        name="estado_faltante_311"
                                        value={formData.estado_faltante_311 || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Tab>


                        <Tab eventKey="responsable" title="Responsable del Bien">
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="id_per" className="form-label">ID Persona</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_per"
                                        name="id_per"
                                        value={formData.id_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="tdi_per" className="form-label">Tipo de Documento</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tdi_per"
                                        name="tdi_per"
                                        value={formData.tdi_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="ndi_per" className="form-label">Número de Documento</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ndi_per"
                                        name="ndi_per"
                                        value={formData.ndi_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="expedido_per" className="form-label">Expedido</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="expedido_per"
                                        name="expedido_per"
                                        value={formData.expedido_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="nombre_per" className="form-label">Nombres</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre_per"
                                        name="nombre_per"
                                        value={formData.nombre_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="ap_paterno_per" className="form-label">Apellido Paterno</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ap_paterno_per"
                                        name="ap_paterno_per"
                                        value={formData.ap_paterno_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="ap_materno_per" className="form-label">Apellido Materno</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ap_materno_per"
                                        name="ap_materno_per"
                                        value={formData.ap_materno_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="ap_conyuge_per" className="form-label">Apellido de Cónyuge</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ap_conyuge_per"
                                        name="ap_conyuge_per"
                                        value={formData.ap_conyuge_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="sexo_per" className="form-label">Sexo</label>
                                    <select
                                        className="form-select"
                                        id="sexo_per"
                                        name="sexo_per"
                                        value={formData.sexo_per || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccione...</option>
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="f_nacimiento_per" className="form-label">Fecha de Nacimiento</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="f_nacimiento_per"
                                        name="f_nacimiento_per"
                                        value={formData.f_nacimiento_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="c_civil_per" className="form-label">Estado Civil</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="c_civil_per"
                                        name="c_civil_per"
                                        value={formData.c_civil_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="profesion_per" className="form-label">Profesión</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="profesion_per"
                                        name="profesion_per"
                                        value={formData.profesion_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="direccion_per" className="form-label">Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="direccion_per"
                                        name="direccion_per"
                                        value={formData.direccion_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="telefono_per" className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="telefono_per"
                                        name="telefono_per"
                                        value={formData.telefono_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="celular_per" className="form-label">Celular</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="celular_per"
                                        name="celular_per"
                                        value={formData.celular_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="email_per" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email_per"
                                        name="email_per"
                                        value={formData.email_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="estado_per" className="form-label">Estado</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="estado_per"
                                        name="estado_per"
                                        value={formData.estado_per || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Tab>


                        <Tab eventKey="clasificacion" title="Clasificación del Bien">
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <label htmlFor="id_clasi_2" className="form-label">ID Clasificador</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_clasi_2"
                                        name="id_clasi_2"
                                        value={formData.id_clasi_2 || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="codigo_clasi" className="form-label">Código Clasificador</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codigo_clasi"
                                        name="codigo_clasi"
                                        value={formData.codigo_clasi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="nombre_clasi" className="form-label">Nombre Clasificador</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre_clasi"
                                        name="nombre_clasi"
                                        value={formData.nombre_clasi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="descripcion_clasi" className="form-label">Descripción</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="descripcion_clasi"
                                        name="descripcion_clasi"
                                        value={formData.descripcion_clasi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="id_sg_clasi" className="form-label">ID Subgrupo Clasificador</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_sg_clasi"
                                        name="id_sg_clasi"
                                        value={formData.id_sg_clasi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="nombre_sg_clasi" className="form-label">Nombre Subgrupo Clasificador</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre_sg_clasi"
                                        name="nombre_sg_clasi"
                                        value={formData.nombre_sg_clasi || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Tab>


                        <Tab eventKey="funcionario" title="Funcionario Asignado">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="id_func" className="form-label">ID Funcionario</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_func"
                                        name="id_func"
                                        value={formData.id_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="tipo_func" className="form-label">Tipo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tipo_func"
                                        name="tipo_func"
                                        value={formData.tipo_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="num_file" className="form-label">Número de File</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="num_file"
                                        name="num_file"
                                        value={formData.num_file || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="item_func" className="form-label">Item</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="item_func"
                                        name="item_func"
                                        value={formData.item_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="telefono_func" className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="telefono_func"
                                        name="telefono_func"
                                        value={formData.telefono_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="interno_func" className="form-label">Interno</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="interno_func"
                                        name="interno_func"
                                        value={formData.interno_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="estado_func" className="form-label">Estado</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="estado_func"
                                        name="estado_func"
                                        value={formData.estado_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Tab>


                        <Tab eventKey="cargo" title="Cargo del Funcionario">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="id_cargo_func" className="form-label">ID Cargo Funcionario</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_cargo_func"
                                        name="id_cargo_func"
                                        value={formData.id_cargo_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="id_ubi_func" className="form-label">ID Ubicación Funcionario</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_ubi_func"
                                        name="id_ubi_func"
                                        value={formData.id_ubi_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="id_act_func" className="form-label">ID Activo Funcionario</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_act_func"
                                        name="id_act_func"
                                        value={formData.id_act_func || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="id_cargo" className="form-label">ID Cargo</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_cargo"
                                        name="id_cargo"
                                        value={formData.id_cargo || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="codigo_cargo" className="form-label">Código de Cargo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codigo_cargo"
                                        name="codigo_cargo"
                                        value={formData.codigo_cargo || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="nombre_cargo" className="form-label">Nombre de Cargo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre_cargo"
                                        name="nombre_cargo"
                                        value={formData.nombre_cargo || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="descripcion_cargo" className="form-label">Descripción de Cargo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="descripcion_cargo"
                                        name="descripcion_cargo"
                                        value={formData.descripcion_cargo || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="estado_cargo" className="form-label">Estado del Cargo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="estado_cargo"
                                        name="estado_cargo"
                                        value={formData.estado_cargo || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="id_af_cargo" className="form-label">ID Agrupación Física (Cargo)</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_af_cargo"
                                        name="id_af_cargo"
                                        value={formData.id_af_cargo || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Tab>


                        <Tab eventKey="ubicacion" title="Ubicación del Bien">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="id_ubi" className="form-label">ID Ubicación</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_ubi"
                                        name="id_ubi"
                                        value={formData.id_ubi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="codigo_ubi" className="form-label">Código de Ubicación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codigo_ubi"
                                        name="codigo_ubi"
                                        value={formData.codigo_ubi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="nombre_ubi" className="form-label">Nombre de Ubicación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre_ubi"
                                        name="nombre_ubi"
                                        value={formData.nombre_ubi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="direccion_ubi" className="form-label">Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="direccion_ubi"
                                        name="direccion_ubi"
                                        value={formData.direccion_ubi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="distrito_ubi" className="form-label">Distrito</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="distrito_ubi"
                                        name="distrito_ubi"
                                        value={formData.distrito_ubi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="observaciones_ubi" className="form-label">Observaciones</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="observaciones_ubi"
                                        name="observaciones_ubi"
                                        value={formData.observaciones_ubi || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="estado_ubi" className="form-label">Estado</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="estado_ubi"
                                        name="estado_ubi"
                                        value={formData.estado_ubi || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Tab>


                        <Tab eventKey="agrupacion" title="Agrupación Física">
                            <div className="row">
                                <div className="col-md-3 mb-3">
                                    <label htmlFor="id_af" className="form-label">ID Agrupación Física</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="id_af"
                                        name="id_af"
                                        value={formData.id_af || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-3 mb-3">
                                    <label htmlFor="codigo_af" className="form-label">Código de Agrupación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="codigo_af"
                                        name="codigo_af"
                                        value={formData.codigo_af || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-4 mb-3">
                                    <label htmlFor="nombre_af" className="form-label">Nombre de Agrupación</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nombre_af"
                                        name="nombre_af"
                                        value={formData.nombre_af || ''}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-md-2 mb-3">
                                    <label htmlFor="estado_af" className="form-label">Estado</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="estado_af"
                                        name="estado_af"
                                        value={formData.estado_af || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                    <button type="submit" className="btn btn-primary mt-3">Registrar</button>
                </form>
            </div>

        </div>
    );
};

export default RegistroEdificio;
