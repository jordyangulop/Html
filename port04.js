// ========== NAVEGACIÓN DINÁMICA ENTRE SECCIONES ==========
const secciones = document.querySelectorAll('.seccion');
const enlacesNav = document.querySelectorAll('.navbar a, .logo');
const botonesConSeccion = document.querySelectorAll('[data-seccion]');

function cambiarSeccion(idSeccion) {
    if (!idSeccion) return;
    
    // Ocultar todas las secciones
    secciones.forEach(sec => sec.classList.remove('activa'));
    
    // Mostrar la sección seleccionada
    const activar = document.getElementById(idSeccion);
    if (activar) activar.classList.add('activa');
    
    // Actualizar clase active en el navbar
    enlacesNav.forEach(enlace => {
        const target = enlace.getAttribute('data-seccion');
        if (target === idSeccion) {
            enlace.classList.add('active');
        } else {
            enlace.classList.remove('active');
        }
    });
    
    // Scroll suave al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Manejador de clics para elementos con data-seccion
function handleNavClick(e) {
    const elemento = e.currentTarget;
    const seccionDestino = elemento.getAttribute('data-seccion');
    if (seccionDestino) {
        e.preventDefault();
        cambiarSeccion(seccionDestino);
    }
}

// Asignar eventos a enlaces del navbar y logo
enlacesNav.forEach(el => {
    // Si no tiene data-seccion, asignar según su texto o clase
    if (!el.getAttribute('data-seccion')) {
        if (el.classList.contains('logo')) {
            el.setAttribute('data-seccion', 'inicio');
        }
    }
    el.addEventListener('click', handleNavClick);
});

// Asignar eventos a todos los botones que tengan data-seccion
botonesConSeccion.forEach(btn => {
    // Evitar duplicados
    btn.removeEventListener('click', handleNavClick);
    btn.addEventListener('click', handleNavClick);
});

// Inicializar con la sección de inicio
cambiarSeccion('inicio');

// ========== FORMULARIO DE CONTACTO ==========
const formContact = document.getElementById('formContacto');
if (formContact) {
    formContact.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const mensaje = document.getElementById('mensaje')?.value.trim();
        const feedback = document.getElementById('formFeedback');
        
        // Validaciones
        if (!nombre || !email || !mensaje) {
            feedback.innerHTML = '<span style="color:#ff9b9b;">❌ Por favor, completa todos los campos.</span>';
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            feedback.innerHTML = '<span style="color:#ff9b9b;">📧 Ingresa un correo electrónico válido.</span>';
            return;
        }
        
        // Simular envío
        feedback.innerHTML = '<span style="color:#4ecdc4;">⏳ Enviando mensaje...</span>';
        
        setTimeout(() => {
            feedback.innerHTML = '<span style="color:#90f5c8;">✅ ¡Mensaje enviado con éxito! Jhordy te responderá pronto.</span>';
            formContact.reset();
            
            // Limpiar feedback después de 4 segundos
            setTimeout(() => {
                if (feedback) feedback.innerHTML = '';
            }, 4000);
        }, 1200);
    });
}

// ========== EFECTO EXTRA: Resaltar botón activo al hacer scroll (opcional) ==========
// Esto mejora la experiencia cuando se navega con scroll manual
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY + 150;
        let currentSection = '';
        
        secciones.forEach(seccion => {
            const sectionTop = seccion.offsetTop;
            const sectionBottom = sectionTop + seccion.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = seccion.getAttribute('id');
            }
        });
        
        if (currentSection) {
            enlacesNav.forEach(enlace => {
                const target = enlace.getAttribute('data-seccion');
                if (target === currentSection) {
                    enlace.classList.add('active');
                } else {
                    enlace.classList.remove('active');
                }
            });
        }
    }, 100);
});

console.log('✅ Portafolio cargado correctamente | Todos los botones son funcionales y redirigibles');