import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { RegistroUsuario } from './pages/RegistroUsuario';
import RecuperarContrasena from './pages/RecuperarContrasena';
import PrimeraVez from './pages/PrimeraVez';
import CuentaDeshabilitada from './pages/CuentaDeshabilitada';
import PanelControl from './pages/PanelControl';
import Layout from './components/Layout';
import { EditarUsuario } from './pages/EditarUsuario';
import Usuarios from './pages/Usuarios';
import ListaEdificios from './pages/edificios/ListaEdificios';
import RegistroEdificio from './pages/edificios/RegistroEdificio';
import EditarEdificio from './pages/edificios/EditarEdificio';
import Parametros from './pages/parametros/Parametros';
import DireccionesAdministrativas from './pages/parametros/direcciones-administrativas/DireccionesAdministrativas';
import RegistroDireccionAdministrativa from './pages/parametros/direcciones-administrativas/RegistroDireccionAdministrativa';
import EditarDireccionAdministrativa from './pages/parametros/direcciones-administrativas/EditarDireccionAdministrativa';
import UnidadesOrganizacionales from './pages/parametros/unidades-organizacionales/UnidadesOrganizacionales';
import RegistroUnidadesOrganizacionales from './pages/parametros/unidades-organizacionales/RegistroUnidadesOrganizacionales';
import EditarUnidadesOrganizacionales from './pages/parametros/unidades-organizacionales/EditarUnidadesOrganizacionales';
import Ambientes from './pages/parametros/ambientes/ambientes';
import RegistroAmbientes from './pages/parametros/ambientes/RegistroAmbientes';
import EditarAmbientes from './pages/parametros/ambientes/EditarAmbientes';


function App() {
  // ✅ Nueva validación basada en existencia de token
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token; // true si existe token

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistroUsuario />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />
        <Route path="/primera-vez" element={<PrimeraVez />} />
        <Route path="/deshabilitada" element={<CuentaDeshabilitada />} />

        {/* Rutas privadas */}
        {isAuthenticated && (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/panel-control" element={<PanelControl />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/crear" element={<RegistroUsuario />} />
            <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
            <Route path="/edificios" element={<ListaEdificios />} />
            <Route path="/edificios/nuevo" element={<RegistroEdificio />} />
            <Route path="/edificios/editar/:id" element={<EditarEdificio />} />
            <Route path="/parametros" element={<Parametros />} />
            <Route path="/parametros/direcciones-administrativas" element={<DireccionesAdministrativas />} />
            <Route path="/parametros/direcciones-administrativas/nueva" element={<RegistroDireccionAdministrativa />} />
            <Route path="/parametros/direcciones-administrativas/editar/:id" element={<EditarDireccionAdministrativa />} />
            <Route path="/parametros/unidades-organizacionales" element={<UnidadesOrganizacionales />} />
            <Route path="/parametros/unidades-organizacionales/registrar" element={<RegistroUnidadesOrganizacionales />} />
            <Route path="/parametros/unidades-organizacionales/editar/:id" element={<EditarUnidadesOrganizacionales />} />
            <Route path="/parametros/ambientes" element={<Ambientes />} />
            <Route path="/parametros/ambientes/registrar" element={<RegistroAmbientes />} />
            <Route path="/parametros/ambientes/editar/:id" element={<EditarAmbientes />} />

          </Route>
        )}

        {/* Redirigir si no está autenticado */}
        {!isAuthenticated && (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
