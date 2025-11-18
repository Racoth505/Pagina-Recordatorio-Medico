import React, { useState, useEffect } from 'react';
import './App.css'; 
import usuariosAzul from './assets/usuarios-azul.png'; 

const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

function VerPacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [recetasMap, setRecetasMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pacienteExpandidoId, setPacienteExpandidoId] = useState(null);
  const [error, setError] = useState(null);
  const [loadingRecetaId, setLoadingRecetaId] = useState(null);

  // --- ESTADOS DEL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pacienteAEliminar, setPacienteAEliminar] = useState(null);

  // Cargar pacientes
  useEffect(() => {
    const fetchPacientesDelDoctor = async () => {
      try {
        const loggedInDoctorId = localStorage.getItem('userId');
        if (!loggedInDoctorId) throw new Error("No se pudo encontrar el ID del doctor.");

        const payload = {
          action: "getPatientsByDoctor",
          data: { doctorId: loggedInDoctorId }
        };

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "No se pudieron cargar los pacientes.");
        }

        const pacientesDeLaNube = await response.json();
        setPacientes(pacientesDeLaNube);

      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPacientesDelDoctor();
  }, []);

  // Abrir modal de confirmación
  const abrirModalEliminar = (paciente) => {
    setPacienteAEliminar(paciente);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const cerrarModal = () => {
    setIsModalOpen(false);
    setPacienteAEliminar(null);
  };

  // Confirmar eliminación
  const confirmarEliminar = async () => {
    if (!pacienteAEliminar) return;

    try {
      const payload = {
        action: "deletePatient",
        data: { pacienteId: pacienteAEliminar.id }
      };

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error al eliminar el paciente.");

      // Eliminar localmente
      setPacientes(prev => prev.filter(p => p.id !== pacienteAEliminar.id));

    } catch (err) {
      alert("Error: " + err.message);
    }

    cerrarModal();
  };

  // Expandir recetas
  const toggleRecetas = async (pacienteId) => {
    if (pacienteExpandidoId === pacienteId) {
      setPacienteExpandidoId(null);
      return;
    }

    setPacienteExpandidoId(pacienteId);

    if (recetasMap[pacienteId]) return;

    setLoadingRecetaId(pacienteId);

    try {
      const payload = {
        action: "getRecipesByPatient",
        data: { pacienteId }
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Error al cargar las recetas");

      const recetasDelPaciente = await response.json();

      setRecetasMap(prev => ({
        ...prev,
        [pacienteId]: recetasDelPaciente
      }));

    } catch (err) {
      setRecetasMap(prev => ({
        ...prev,
        [pacienteId]: { error: err.message }
      }));
    } finally {
      setLoadingRecetaId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="usuarios-container">
        <h2 className="page-title">
          <img src={usuariosAzul} alt="Pacientes" />
          Mis pacientes
        </h2>
        <p style={{ padding: '20px', textAlign: 'center' }}>Cargando pacientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="usuarios-container">
        <h2 className="page-title">
          <img src={usuariosAzul} alt="Pacientes" />
          Mis pacientes
        </h2>
        <p style={{ padding: '20px', textAlign: 'center', color: 'red' }}>{error}</p>
      </div>
    );
  }

  const pacientesOrdenados = [...pacientes].sort((a, b) =>
    a.nombreCompleto.localeCompare(b.nombreCompleto)
  );

  return (
    <div className="usuarios-container">
      <h2 className="page-title">
        <img src={usuariosAzul} alt="Pacientes" />
        Mis pacientes
      </h2>

      <div className="lista-items-container">
        {pacientesOrdenados.length === 0 && (
          <p style={{ textAlign: 'center' }}>No tienes pacientes registrados.</p>
        )}

        {pacientesOrdenados.map(paciente => {
          const recetasDelPaciente = recetasMap[paciente.id] || [];
          const isExpandido = pacienteExpandidoId === paciente.id;
          const numRecetas = Array.isArray(recetasDelPaciente) ? recetasDelPaciente.length : 0;

          return (
            <div key={paciente.id} className="item-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4>{paciente.nombreCompleto}</h4>
                  <p><strong>Alergias:</strong> {paciente.alergias || 'N/A'}</p>
                  <p style={{ fontSize: '0.9rem', color: '#555' }}>
                    ID: {paciente.id} | Tel: {paciente.telefono || 'N/A'}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className={`btn btn-danger`}
                    onClick={() => abrirModalEliminar(paciente)}
                  >
                    Eliminar
                  </button>

                  <button
                    className={`btn ${isExpandido ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => toggleRecetas(paciente.id)}
                    disabled={loadingRecetaId === paciente.id}
                  >
                    {loadingRecetaId === paciente.id ? 'Cargando...' :
                      (isExpandido ? 'Ocultar' : 'Ver Recetas') + ` (${numRecetas})`}
                  </button>
                </div>
              </div>

              {isExpandido && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                  <h5>Historial de Recetas:</h5>

                  {loadingRecetaId === paciente.id && (
                    <p style={{ fontSize: '0.9rem' }}>Cargando historial...</p>
                  )}

                  {Array.isArray(recetasDelPaciente) && recetasDelPaciente.length === 0 && (
                    <p>No hay recetas para este paciente.</p>
                  )}

                  {Array.isArray(recetasDelPaciente) &&
                    recetasDelPaciente.length > 0 &&
                    [...recetasDelPaciente].reverse().map(receta => (
                      <div key={receta.id} className="receta-card">
                        <p><strong>Fecha:</strong> {receta.fechaEmision}</p>
                        <p><strong>Diagnóstico:</strong> {receta.diagnostico}</p>

                        <div className="medicamentos-list">
                          {receta.medicamentos.map(med => (
                            <div key={med.id} className="medicamento-item">
                              <strong>{med.nombre_medicamento}</strong>
                              <p>{med.dosis} • {med.frecuencia}h • {med.duracion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* --- MODAL ESTÁNDAR --- */}
      {isModalOpen && pacienteAEliminar && (
        <div className="modal-overlay">
          <div className="modal-content">

            <div className="modal-header">
              <h3 className="modal-title">Confirmar Eliminación</h3>
            </div>

            <div className="modal-body">
              <p>
                ¿Está seguro de que desea eliminar al paciente
                <strong className="user-name-highlight">
                  {` ${pacienteAEliminar.nombreCompleto} `}
                </strong>
                con ID
                <code className="user-id-highlight">
                  {` ${pacienteAEliminar.id} `}
                </code>?
              </p>
              <p className="warning-text">Esta acción es irreversible.</p>
            </div>

            <div className="modal-footer">
              <button className="modal-cancel-btn" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="modal-confirm-btn" onClick={confirmarEliminar}>
                Sí, Eliminar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default VerPacientes;