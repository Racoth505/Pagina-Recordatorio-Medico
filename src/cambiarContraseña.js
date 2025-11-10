// Función para cambiar la contraseña
function cambiarContraseña() {
    // Obtener los valores de los campos
    const nuevaContraseña = document.getElementById('nuevaContraseña').value;
    const confirmarContraseña = document.getElementById('confirmarContraseña').value;
    const mensajeDiv = document.getElementById('mensaje');
    
    // Limpiar mensajes anteriores
    mensajeDiv.innerHTML = '';
    mensajeDiv.className = '';
    
    // Validar que los campos no estén vacíos
    if (!nuevaContraseña || !confirmarContraseña) {
        mostrarMensaje('Por favor, completa todos los campos', 'error');
        return false;
    }
    
    // Validar que las contraseñas coincidan
    if (nuevaContraseña !== confirmarContraseña) {
        mostrarMensaje('Las contraseñas no coinciden', 'error');
        return false;
    }
    
    // Validar longitud mínima de contraseña
    if (nuevaContraseña.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
        return false;
    }
    
    // Simular cambio de contraseña (aquí iría la llamada a tu API)
    // En un entorno real, esto se conectaría con tu backend
    setTimeout(() => {
        mostrarMensaje('¡Contraseña cambiada exitosamente!', 'success');
        
        // Limpiar campos después del cambio exitoso
        document.getElementById('nuevaContraseña').value = '';
        document.getElementById('confirmarContraseña').value = '';
        
        // Aquí puedes agregar redirección o otras acciones después del cambio
        console.log('Contraseña cambiada para el usuario:', nuevaContraseña);
    }, 1000);
    
    return false; // Prevenir envío del formulario
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = tipo; // 'error' o 'success'
}

// Función para inicializar el formulario
function inicializarFormularioContraseña() {
    const formulario = document.getElementById('formCambioContraseña');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            cambiarContraseña();
        });
    }
    
    // Agregar validación en tiempo real
    const confirmarInput = document.getElementById('confirmarContraseña');
    if (confirmarInput) {
        confirmarInput.addEventListener('input', validarCoincidenciaEnTiempoReal);
    }
}

// Validación en tiempo real de coincidencia de contraseñas
function validarCoincidenciaEnTiempoReal() {
    const nuevaContraseña = document.getElementById('nuevaContraseña').value;
    const confirmarContraseña = document.getElementById('confirmarContraseña').value;
    const mensajeDiv = document.getElementById('mensaje');
    
    if (confirmarContraseña && nuevaContraseña !== confirmarContraseña) {
        mensajeDiv.textContent = 'Las contraseñas no coinciden';
        mensajeDiv.className = 'error';
    } else if (confirmarContraseña && nuevaContraseña === confirmarContraseña) {
        mensajeDiv.textContent = 'Las contraseñas coinciden';
        mensajeDiv.className = 'success';
    } else {
        mensajeDiv.textContent = '';
        mensajeDiv.className = '';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarFormularioContraseña();
});

// Exportar funciones para uso en otros módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cambiarContraseña,
        mostrarMensaje,
        inicializarFormularioContraseña
    };
}
