import { Routes, Route } from 'react-router-dom';
import Login from './Login'; // Tu componente de Login
import DoctorDashboardLayout from './DashboardLayout'; // El nuevo layout
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


function App() {
  return (
    <Routes>
      {/* Ruta 1: El Login (ocupa toda la página) */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Ruta del DOCTOR: Usa el layout del doctor */}
      <Route path="/doctor" element={<DoctorDashboardLayout />}>
        <Route path="ver-pacientes" element={<VerPacientes />} />
        <Route path="agregar-receta" element={<AgregarReceta />} />
        <Route path="agregar-pacientes" element={<AgregarPacientes />} />
        <Route path="perfil" element={<div>Mi Perfil del Doctor</div>} />
        <Route index element={<VerPacientes />} />
      </Route>
      
      {/* Ruta 2: El "Dashboard" que usa el layout compartido */}
      <Route path="/dashboard" element={<DoctorDashboardLayout />}>
        {/* Estas son las páginas "hijas" que se mostrarán dentro del layout */}
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="agregar-usuario" element={<AgregarUsuario />} />
        <Route path="editar-usuario" element={<EditarUsuario />} />
        
        {/* Opcional: una ruta por defecto */}
        <Route index element={<Usuarios />} /> 
      </Route>
    </Routes>
  );
}

export default App;
