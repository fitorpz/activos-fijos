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
import ListaEdificios from './pages/activosFijos/edificios/ListaEdificios';
import RegistroEdificio from './pages/activosFijos/edificios/RegistroEdificio';
import EditarEdificio from './pages/activosFijos/edificios/EditarEdificio';
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
import Areas from './pages/parametros/areas/Areas';
import RegistroAreas from './pages/parametros/areas/RegistroAreas';
import EditarAreas from './pages/parametros/areas/EditarAreas';
import GruposContables from './pages/parametros/grupos-contables/GruposContables';
import RegistroGrupoContable from './pages/parametros/grupos-contables/RegistroGrupoContable';
import EditarGrupoContable from './pages/parametros/grupos-contables/EditarGrupoContable';
import Auxiliares from './pages/parametros/auxiliares/Auxiliares';
import RegistroAuxiliar from './pages/parametros/auxiliares/RegistroAuxiliar';
import EditarAuxiliar from './pages/parametros/auxiliares/EditarAuxiliar';
import Personales from './pages/parametros/personales/Personales';
import RegistroPersonal from './pages/parametros/personales/RegistroPersonal';
import EditarPersonal from './pages/parametros/personales/EditarPersonal';
import ListaCargos from './pages/parametros/cargos/Cargos';
import RegistroCargos from './pages/parametros/cargos/RegistroCargos';
import EditarCargos from './pages/parametros/cargos/EditarCargos';
import Nucleos from './pages/parametros/nucleos/Nucleos';
import RegistroNucleo from './pages/parametros/nucleos/RegistroNucleo';
import EditarNucleo from './pages/parametros/nucleos/EditarNucleo';
import Ciudades from './pages/parametros/ciudades/Ciudades';
import RegistroCiudad from './pages/parametros/ciudades/RegistroCiudad';
import EditarCiudad from './pages/parametros/ciudades/EditarCiudad';
import ImprimirTickets from './pages/tickets/ImprimirTickets';


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
            <Route path="/parametros/areas" element={<Areas />} />
            <Route path="/parametros/areas/registrar" element={<RegistroAreas />} />
            <Route path="/parametros/areas/editar/:id" element={<EditarAreas />} />
            <Route path="/parametros/grupos-contables" element={<GruposContables />} />
            <Route path="/parametros/grupos-contables/registrar" element={<RegistroGrupoContable />} />
            <Route path="/parametros/grupos-contables/editar/:id" element={<EditarGrupoContable />} />
            <Route path="/parametros/auxiliares" element={<Auxiliares />} />
            <Route path="/parametros/auxiliares/registrar" element={<RegistroAuxiliar />} />
            <Route path="/parametros/auxiliares/editar/:id" element={<EditarAuxiliar />} />
            <Route path="/parametros/personales" element={<Personales />} />
            <Route path="/parametros/personales/registrar" element={<RegistroPersonal />} />
            <Route path="/parametros/personales/editar/:id" element={<EditarPersonal />} />
            <Route path="/parametros/cargos" element={<ListaCargos />} />
            <Route path="/parametros/cargos/registrar" element={<RegistroCargos />} />
            <Route path="/parametros/cargos/editar/:id" element={<EditarCargos />} />
            <Route path="/parametros/nucleos" element={<Nucleos />} />
            <Route path="/parametros/nucleos/nuevo" element={<RegistroNucleo />} />
            <Route path="/parametros/nucleos/editar/:id" element={<EditarNucleo />} />
            <Route path="/parametros/ciudades" element={<Ciudades />} />
            <Route path="/parametros/ciudades/nuevo" element={<RegistroCiudad />} />
            <Route path="/parametros/ciudades/editar/:id" element={<EditarCiudad />} />
            <Route path="/tickets/imprimir" element={<ImprimirTickets />} />
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
