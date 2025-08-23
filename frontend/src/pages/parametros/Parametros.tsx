import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const parametros = [
    {
        titulo: 'CONTABILIDAD',
        icono: 'bi-calculator',
        color: 'primary',
        items: [
            { label: 'Grupo Contable', path: '/parametros/grupo-contable' },
            { label: 'Auxiliares (Subgrupos)', path: '/parametros/auxiliares' },
        ],
    },
    {
        titulo: 'ESTRUCTURA ADMINISTRATIVA',
        icono: 'bi-diagram-3',
        color: 'info',
        items: [
            { label: 'Direcciones Administrativas', path: '/parametros/direcciones-administrativas' },
            { label: 'Unidades Organizacionales', path: '/parametros/unidades-organizacionales' },
            { label: 'Ambientes', path: '/parametros/ambientes' },
        ],
    },
    {
        titulo: 'RECURSOS HUMANOS',
        icono: 'bi-person-lines-fill',
        color: 'success',
        items: [
            { label: 'Personal', path: '/parametros/personal' },
            { label: 'Cargos', path: '/parametros/cargos' },
        ],
    },
];

const Parametros = () => {
    const navigate = useNavigate();

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Parámetros del Sistema</h2>
            <div className="row">
                {parametros.map((cat, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className={`card shadow h-100 border-${cat.color}`}>
                            <div className="card-body">
                                <div className="text-center mb-3">
                                    <i className={`bi ${cat.icono} display-4 text-${cat.color}`}></i>
                                </div>
                                <h5 className="card-title text-center">{cat.titulo}</h5>
                                <ul className="list-unstyled">
                                    {cat.items.map((item, i) => (
                                        <li key={i}>
                                            <button
                                                className="btn btn-link text-decoration-none p-0"
                                                onClick={() => navigate(item.path)}
                                            >
                                                <i className="bi bi-chevron-right me-2"></i> {item.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Parametros;
