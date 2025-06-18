// script.js

document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DEL MODO OSCURO/CLARO ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Función para aplicar el tema y actualizar las partículas
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggle.checked = true;
        } else {
            body.classList.remove('dark-mode');
            themeToggle.checked = false;
        }
    }

    // Cargar el tema guardado al iniciar la página
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Evento para el interruptor de tema
    themeToggle.addEventListener('click', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });


    // --- LÓGICA DE PARTICLES.JS ---
    function initParticles(theme) {
        const colors = getParticleColors(theme);
        
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 300, "density": { "enable": true, "value_area": 700 } },
                "color": { "value": colors.particleColor },
                "shape": { "type": "circle" },
                "opacity": { "value": 1.5, "random": true },
                "size": { "value": 9, "random": true },
                "line_linked": {
                    "enable": false,
                    "distance": 150,
                    "color": colors.lineColor,
                    "opacity": 0.4,
                    "width": 4
                },
                "move": {
                    "enable": true, "speed": 3, "direction": "none", "random": true,
                    "straight": false, "out_mode": "out", "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": { "enable": true, "mode": "bubble" },
                    "onclick": { "enable": true, "mode": "push" },
                    "resize": true
                },
                "modes": {
                    "bubble": { "distance": 250, "size": 0, "duration": 2, "opacity": 0 },
                    "push": { "particles_nb": 4 }
                }
            },
            "retina_detect": true
        });
    }

    // Función para obtener los colores de las partículas según el tema
    function getParticleColors(theme) {
        if (theme === 'dark') {
            return { particleColor: '#00BFFF', lineColor: '#00BFFF' };
        } else {
            return { particleColor: '#3a3a7e', lineColor: '#3a3a7e' };
        }
    }
    
    // Función para actualizar los colores sin reiniciar toda la animación
    function updateParticlesColor(theme) {
        const colors = getParticleColors(theme);
        if (window.pJSDom && window.pJSDom[0]) {
            const pJS = window.pJSDom[0].pJS;
            pJS.particles.color.value = colors.particleColor;
            pJS.particles.line_linked.color = colors.lineColor;
            pJS.fn.particlesRefresh();
        }
    }

    // Inicializa las partículas con el tema actual
    initParticles(savedTheme);


    // --- LÓGICA DEL FORMULARIO DE LOGIN (sin cambios) ---
    const loginForm = document.getElementById('login-form');
    const registerLink = document.getElementById('register-link');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = loginForm.username.value;
        alert(`¡Hola ${username}! \n\nIniciando sesión... (Esto es una demostración)`);
    });
    
    registerLink.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Redirigiendo a la página de registro... (Esto es una demostración)');
    });
});