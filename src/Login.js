import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';
import heartbeatLogo from './assets/heartbeat_logo.png';

// ⚠️ PEGA AQUÍ LA URL DE TU LAMBDA (Misma que en AgregarUsuario)
const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

function Login() {
    // Nota: Aunque la variable se llame claveUnica, aquí capturamos el Correo para Doctores/Admin
    const [correoInput, setCorreoInput] = useState(''); 
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setCargando(true);

        try {
            // 1. Petición a la API
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'login',
                    data: {
                        correo: correoInput, // Enviamos como correo para buscar en tabla Usuarios
                        password: contrasena
                    }
                })
            });

            const result = await response.json();

            if (response.ok) {
                const usuario = result.user;

                // 2. Guardar sesión en LocalStorage con datos REALES de la BD
                localStorage.setItem('userId', usuario.id);
                localStorage.setItem('rol', usuario.rol);
                localStorage.setItem('nombre', usuario.nombreCompleto);
                
                // Datos opcionales que la API podría o no devolver (evita nulls)
                localStorage.setItem('correo', usuario.correo || '');
                localStorage.setItem('telefono', usuario.telefono || '');
                localStorage.setItem('direccionConsultorio', usuario.direccion || '');
                localStorage.setItem('especialidad', usuario.especialidad || 'Médico General');

                // 3. Redirección según Rol
                switch (usuario.rol) {
                    case 'Administrador':
                        navigate('/dashboard/usuarios'); 
                        break;
                    case 'Doctor':
                        navigate('/doctor/ver-pacientes');
                        break;
                    default:
                        // Si por alguna razón un paciente intenta entrar por aquí (y la lógica lo permite)
                        setError('Este portal es solo para personal médico.');
                        localStorage.clear(); // Limpiar sesión por seguridad
                }
            } else {
                // Error 401 o 404 desde la Lambda
                setError(result.message || 'Credenciales incorrectas.');
            }

        } catch (err) {
            console.error("Error de conexión:", err);
            setError('Error de conexión con el servidor. Intente más tarde.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-aside">
                <div className="logo-circle">
                    <img 
                        src={heartbeatLogo} 
                        alt="Heartbeat Logo" 
                        className="login-logo"
                    />
                </div>
            </div>

            <div className="login-form-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2>Ingresar</h2>

                    <div className="form-group">
                        <label htmlFor="correo-input">Correo Electrónico</label>
                        <input
                            type="email"
                            id="correo-input"
                            value={correoInput}
                            onChange={(e) => setCorreoInput(e.target.value)}
                            placeholder="ejemplo@hospital.com"
                            required
                            disabled={cargando}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contrasena">Contraseña</label>
                        <input
                            type="password"
                            id="contrasena"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                            disabled={cargando}
                        />
                    </div>

                    {error && (
                        <div style={{ 
                            color: '#721c24', 
                            backgroundColor: '#f8d7da', 
                            padding: '10px', 
                            borderRadius: '5px',
                            marginBottom: '15px',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={cargando}
                        style={{ opacity: cargando ? 0.7 : 1 }}
                    >
                        {cargando ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
