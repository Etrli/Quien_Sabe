// Variables globales para almacenar datos del perfil
let profileData = {
    personal: {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        fechaNacimiento: '',
        pais: '',
        ciudad: '',
        bio: '',
        avatar: ''
    },
    preferences: {
        tema: 'claro',
        idioma: 'es',
        zonaHoraria: 'America/Argentina/Buenos_Aires',
        notificacionesEmail: false,
        notificacionesPush: false,
        perfilPublico: true,
        modoDesarrollador: false
    },
    security: {
        twoFactor: false,
        loginAlerts: true
    }
};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    setupEventListeners();
    loadSavedData();
    updatePreview();
});

// Configurar todos los event listeners
function setupEventListeners() {
    // Avatar upload
    const avatarInput = document.getElementById('avatar-input');
    avatarInput.addEventListener('change', handleAvatarUpload);

    // Actualización en tiempo real de la vista previa
    const personalInputs = document.querySelectorAll('#personal-form input, #personal-form select, #personal-form textarea');
    personalInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Botones principales
    document.getElementById('btn-guardar').addEventListener('click', saveProfile);
    document.getElementById('btn-cancelar').addEventListener('click', cancelChanges);

    // Cerrar notificaciones
    document.getElementById('notification-close').addEventListener('click', hideNotification);

    // Validación de contraseñas
    const passwordNueva = document.getElementById('password-nueva');
    const passwordConfirmar = document.getElementById('password-confirmar');
    
    passwordConfirmar.addEventListener('input', validatePasswordMatch);
    passwordNueva.addEventListener('input', validatePasswordMatch);

    // Aplicar tema en tiempo real
    document.getElementById('tema').addEventListener('change', applyTheme);

    // Preferencias con switches
    const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    switches.forEach(switchEl => {
        switchEl.addEventListener('change', updatePreferences);
    });
}

// Manejo de carga de avatar
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 5 * 1024 * 1024) { // 5MB límite
            showNotification('El archivo es demasiado grande. Máximo 5MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const avatarUrl = e.target.result;
            profileData.personal.avatar = avatarUrl;
            
            // Actualizar imagen en header y preview
            document.getElementById('avatar-img').src = avatarUrl;
            document.getElementById('preview-avatar').src = avatarUrl;
            
            showNotification('Avatar actualizado correctamente', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Actualizar vista previa del perfil
function updatePreview() {
    const nombre = document.getElementById('nombre').value || 'Tu Nombre';
    const apellido = document.getElementById('apellido').value || '';
    const ciudad = document.getElementById('ciudad').value || 'Tu Ciudad';
    const pais = document.getElementById('pais').value || 'País';
    const bio = document.getElementById('bio').value || 'Tu biografía aparecerá aquí...';

    document.getElementById('preview-name').textContent = `${nombre} ${apellido}`.trim();
    document.getElementById('preview-location').textContent = `${ciudad}, ${pais}`;
    document.getElementById('preview-bio').textContent = bio;
}

// Validar coincidencia de contraseñas
function validatePasswordMatch() {
    const passwordNueva = document.getElementById('password-nueva');
    const passwordConfirmar = document.getElementById('password-confirmar');
    
    if (passwordConfirmar.value && passwordNueva.value !== passwordConfirmar.value) {
        passwordConfirmar.setCustomValidity('Las contraseñas no coinciden');
        passwordConfirmar.style.borderColor = '#dc3545';
    } else {
        passwordConfirmar.setCustomValidity('');
        passwordConfirmar.style.borderColor = '#4facfe';
    }
}

// Aplicar tema seleccionado
function applyTheme() {
    const tema = document.getElementById('tema').value;
    const body = document.body;
    
    // Remover clases de tema previas
    body.classList.remove('tema-oscuro', 'tema-claro');
    
    if (tema === 'oscuro') {
        body.classList.add('tema-oscuro');
    } else if (tema === 'claro') {
        body.classList.add('tema-claro');
    }
    // 'auto' usaría las preferencias del sistema
}

// Actualizar preferencias
function updatePreferences() {
    const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    switches.forEach(switchEl => {
        const id = switchEl.id;
        const isChecked = switchEl.checked;
        
        switch(id) {
            case 'notificaciones-email':
                profileData.preferences.notificacionesEmail = isChecked;
                break;
            case 'notificaciones-push':
                profileData.preferences.notificacionesPush = isChecked;
                break;
            case 'perfil-publico':
                profileData.preferences.perfilPublico = isChecked;
                break;
            case 'modo-desarrollador':
                profileData.preferences.modoDesarrollador = isChecked;
                break;
            case 'two-factor':
                profileData.security.twoFactor = isChecked;
                break;
            case 'login-alerts':
                profileData.security.loginAlerts = isChecked;
                break;
        }
    });
}

// Guardar perfil
function saveProfile() {
    // Validar campos requeridos
    if (!validateForm()) {
        return;
    }

    // Recopilar datos del formulario
    collectFormData();

    // Simular guardado (en una app real, esto sería una llamada a la API)
    setTimeout(() => {
        showNotification('Perfil guardado exitosamente', 'success');
        
        // Actualizar datos guardados
        saveToStorage();
        
        // Opcional: redireccionar o actualizar UI
        updateSaveButton();
    }, 1000);

    // Mostrar indicador de carga
    showLoadingState();
}

// Validar formulario
function validateForm() {
    const requiredFields = [
        { id: 'nombre', name: 'Nombre' },
        { id: 'email', name: 'Correo electrónico' }
    ];

    for (let field of requiredFields) {
        const element = document.getElementById(field.id);
        if (!element.value.trim()) {
            showNotification(`El campo ${field.name} es requerido`, 'error');
            element.focus();
            return false;
        }
    }

    // Validar email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        showNotification('Por favor ingresa un correo electrónico válido', 'error');
        email.focus();
        return false;
    }

    // Validar contraseñas si se están cambiando
    const passwordNueva = document.getElementById('password-nueva');
    const passwordConfirmar = document.getElementById('password-confirmar');
    
    if (passwordNueva.value || passwordConfirmar.value) {
        if (passwordNueva.value !== passwordConfirmar.value) {
            showNotification('Las contraseñas no coinciden', 'error');
            passwordConfirmar.focus();
            return false;
        }
        
        if (passwordNueva.value.length < 8) {
            showNotification('La contraseña debe tener al menos 8 caracteres', 'error');
            passwordNueva.focus();
            return false;
        }
    }

    return true;
}

// Recopilar datos del formulario
function collectFormData() {
    // Datos personales
    profileData.personal = {
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
        fechaNacimiento: document.getElementById('fecha-nacimiento').value,
        pais: document.getElementById('pais').value,
        ciudad: document.getElementById('ciudad').value,
        bio: document.getElementById('bio').value,
        avatar: profileData.personal.avatar || ''
    };

    // Preferencias
    profileData.preferences = {
        tema: document.getElementById('tema').value,
        idioma: document.getElementById('idioma').value,
        zonaHoraria: document.getElementById('zona-horaria').value,
        notificacionesEmail: document.getElementById('notificaciones-email').checked,
        notificacionesPush: document.getElementById('notificaciones-push').checked,
        perfilPublico: document.getElementById('perfil-publico').checked,
        modoDesarrollador: document.getElementById('modo-desarrollador').checked
    };

    // Seguridad
    profileData.security = {
        twoFactor: document.getElementById('two-factor').checked,
        loginAlerts: document.getElementById('login-alerts').checked
    };
}

// Cancelar cambios
function cancelChanges() {
    if (confirm('¿Estás seguro de que quieres descartar los cambios?')) {
        loadSavedData();
        showNotification('Cambios descartados', 'info');
    }
}

// Cargar datos guardados
function loadSavedData() {
    // En una aplicación real, esto cargaría desde una API
    // Por ahora, usar datos por defecto o del almacenamiento local simulado
    
    // Cargar datos personales
    Object.keys(profileData.personal).forEach(key => {
        const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
        if (element) {
            element.value = profileData.personal[key] || '';
        }
    });

    // Cargar preferencias
    document.getElementById('tema').value = profileData.preferences.tema;
    document.getElementById('idioma').value = profileData.preferences.idioma;
    document.getElementById('zona-horaria').value = profileData.preferences.zonaHoraria;
    
    // Cargar switches
    document.getElementById('notificaciones-email').checked = profileData.preferences.notificacionesEmail;
    document.getElementById('notificaciones-push').checked = profileData.preferences.notificacionesPush;
    document.getElementById('perfil-publico').checked = profileData.preferences.perfilPublico;
    document.getElementById('modo-desarrollador').checked = profileData.preferences.modoDesarrollador;
    document.getElementById('two-factor').checked = profileData.security.twoFactor;
    document.getElementById('login-alerts').checked = profileData.security.loginAlerts;

    // Aplicar tema
    applyTheme();
    
    // Actualizar vista previa
    updatePreview();
}

// Guardar en almacenamiento (simulado)
function saveToStorage() {
    // En una aplicación real, esto enviaría los datos a un servidor
    console.log('Datos del perfil guardados:', profileData);
    
    // Simular almacenamiento local
    try {
        // Normalmente usaríamos localStorage aquí, pero como está restringido
        // en artifacts, solo lo simulamos
        console.log('Perfil guardado exitosamente en el almacenamiento');
    } catch (error) {
        console.error('Error al guardar:', error);
    }
}

// Mostrar notificación
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    notificationText.textContent = message;
    notification.className = `notification ${type} show`;
    
    // Auto-ocultar después de 4 segundos
    setTimeout(() => {
        hideNotification();
    }, 4000);
}

// Ocultar notificación
function hideNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// Mostrar estado de carga
function showLoadingState() {
    const guardarBtn = document.getElementById('btn-guardar');
    const originalText = guardarBtn.textContent;
    
    guardarBtn.textContent = 'Guardando...';
    guardarBtn.disabled = true;
    
    setTimeout(() => {
        guardarBtn.textContent = originalText;
        guardarBtn.disabled = false;
    }, 1000);
}

// Actualizar botón de guardar
function updateSaveButton() {
    const guardarBtn = document.getElementById('btn-guardar');
    const originalText = guardarBtn.textContent;
    
    guardarBtn.textContent = '✓ Guardado';
    guardarBtn.style.background = '#28a745';
    
    setTimeout(() => {
        guardarBtn.textContent = originalText;
        guardarBtn.style.background = '';
    }, 2000);
}

// Inicializar formulario
function initializeForm() {
    // Configurar fecha máxima para fecha de nacimiento
    const fechaNacimiento = document.getElementById('fecha-nacimiento');
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    fechaNacimiento.max = maxDate.toISOString().split('T')[0];

    // Generar estadísticas aleatorias para la vista previa
    updatePreviewStats();
}

// Actualizar estadísticas de la vista previa
function updatePreviewStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats[0].textContent = Math.floor(Math.random() * 50) + 1; // Proyectos
    stats[1].textContent = Math.floor(Math.random() * 1000) + 50; // Seguidores
    stats[2].textContent = Math.floor(Math.random() * 500) + 25; // Siguiendo
}

// Utilidades adicionales
function formatPhoneNumber(input) {
    // Formatear número de teléfono mientras se escribe
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 10) {
        value = value.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, '+$1 $2 $3-$4');
    }
    input.value = value;
}

// Agregar formato de teléfono en tiempo real
document.getElementById('telefono').addEventListener('input', function() {
    formatPhoneNumber(this);
});

// Efectos visuales adicionales
function addVisualEffects() {
    // Efecto de partículas en el header (opcional)
    const header = document.querySelector('.header');
    
    // Animación de entrada para las secciones
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Agregar animaciones CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .tema-oscuro {
        filter: invert(1) hue-rotate(180deg);
    }
    
    .tema-oscuro img {
        filter: invert(1) hue-rotate(180deg);
    }
`;
document.head.appendChild(style);

// Inicializar efectos visuales
setTimeout(addVisualEffects, 100);