// Espera a que todo el contenido de la página se cargue
document.addEventListener('DOMContentLoaded', () => {
    
    // Obtiene el formulario por su ID
    const loginForm = document.getElementById('login-form');
    
    // Obtiene el enlace de registro por su ID
    const registerLink = document.getElementById('register-link');

    // Añade un evento que se dispara cuando se intenta enviar el formulario
    loginForm.addEventListener('submit', (event) => {
        // previene que la página se recargue (comportamiento por defecto del formulario)
        event.preventDefault(); 

        const username = loginForm.username.value;
        
        // Simulación de un inicio de sesión
        // En una aplicación real, aquí enviarías los datos a un servidor
        alert(`¡Hola ${username}! \n\nIniciando sesión... (Esto es una demostración)`);
        
        // Aquí podrías redirigir a otra página, por ejemplo:
        // window.location.href = '/dashboard.html';
    });
    
    // Añade un evento de clic al enlace de "Registrarse"
    registerLink.addEventListener('click', (event) => {
        event.preventDefault(); // previene que el enlace navegue a "#"
        
        // Simulación de navegación a la página de registro
        alert('Redirigiendo a la página de registro... (Esto es una demostración)');
        
        // En una aplicación real, harías esto:
        // window.location.href = '/registro.html';
    });

});
document.addEventListener('DOMContentLoaded', () => {
    /* ... tu código JavaScript anterior ... */

    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#00BFFF'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                },
                image: {
                    src: 'img/github.svg',
                    width: 100,
                    height: 100
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00BFFF',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 3,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'bubble'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 250,
                    size: 0,
                    duration: 2,
                    opacity: 0,
                    speed: 3
                },
                repulse: {
                    distance: 400,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });

    /* ... el resto de tu código JavaScript ... */
});