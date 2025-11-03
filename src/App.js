import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import DashboardLayoutAdmin from './DashboardLayoutAdmin';
import DashboardLayoutDoctor from './DashboardLayoutDoctor';
import AgregarReceta from './AgregarReceta';
import Usuarios from './Usuarios';
import AgregarUsuario from './AgregarUsuario';
import EditarUsuario from './EditarUsuario';
import './App.css';

const VerPacientes = () => (
  <div className="view-container active">
    <h3>Vista: Ver pacientes</h3>
    <p>Aquí se renderizará la tabla de pacientes.</p>
  </div>
);

const AgregarPacientes = () => (
  <div className="view-container active">
    <h3>Vista: Agregar pacientes</h3>
    <p>Aquí se renderizará el formulario completo para añadir un nuevo paciente.</p>
  </div>
);

const ProtectedRoute = ({ children, rolPermitido }) => {
  const rol = localStorage.getItem('rol');
  if (!rol) return <Navigate to="/login" replace />;
  if (rol !== rolPermitido) {
    switch (rol) {
      case 'Administrador': return <Navigate to="/dashboard" replace />;
      case 'Doctor': return <Navigate to="/doctor" replace />;
      default: return <Navigate to="/login" replace />;
    }
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute rolPermitido="Administrador">
            <DashboardLayoutAdmin />
          </ProtectedRoute>
        }
      >
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="agregar-usuario" element={<AgregarUsuario />} />
        <Route path="editar-usuario" element={<EditarUsuario />} />
        <Route index element={<Usuarios />} />
      </Route>

      {/* DOCTOR */}
      <Route
        path="/doctor/*"
        element={
          <ProtectedRoute rolPermitido="Doctor">
            <DashboardLayoutDoctor />
          </ProtectedRoute>
        }
      >
        <Route path="ver-pacientes" element={<VerPacientes />} />
        <Route path="agregar-pacientes" element={<AgregarPacientes />} />
        <Route path="agregar-receta" element={<AgregarReceta />} />
        <Route path="perfil" element={<div>Mi Perfil del Doctor</div>} />
        <Route index element={<VerPacientes />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
