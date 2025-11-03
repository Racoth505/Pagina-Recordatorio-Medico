import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import usuariosData from './usuarios.json'; // Importamos los datos locales

function Login() {
    const [claveUnica, setClaveUnica] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // Buscar al usuario que coincida
        const usuarioEncontrado = usuariosData.find(
            (u) => 
                (u.correo === claveUnica || u.nombreCompleto === claveUnica) && 
                u.contraseña === contrasena
        );

        if (usuarioEncontrado) {
            // Guardamos el rol para proteger rutas luego
            localStorage.setItem('rol', usuarioEncontrado.rol);
            localStorage.setItem('nombre', usuarioEncontrado.nombreCompleto);

            // Redirigir según el rol
            switch (usuarioEncontrado.rol) {
                case 'Administrador':
                    navigate('/dashboard/admin');
                    break;
                case 'Doctor':
                    navigate('/dashboard/doctor');
                    break;
                case 'Paciente':
                    navigate('/dashboard/paciente');
                    break;
                default:
                    navigate('/dashboard');
            }
        } else {
            setError('Credenciales incorrectas.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-aside">
                <div className="logo-container">
                    <span>[ LOGO ]</span>
                </div>
            </div>

            <div className="login-form-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Ingresar</h2>

                    <div className="form-group">
                        <label htmlFor="clave-unica">Usuario o correo</label>
                        <input
                            type="text"
                            id="clave-unica"
                            value={claveUnica}
                            onChange={(e) => setClaveUnica(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            type="password"
                            id="contrasena"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                        />
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <button type="submit">Ingresar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
