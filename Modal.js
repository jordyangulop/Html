// ========== SISTEMA DE MODAL COMPLETO ==========

class ModalManager {
    constructor() {
        this.modalOverlay = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Crear la estructura del modal si no existe
        if (!document.querySelector('.modal-overlay')) {
            this.createModalStructure();
        } else {
            this.modalOverlay = document.querySelector('.modal-overlay');
            this.bindEvents();
        }
    }

    createModalStructure() {
        const modalHTML = `
            <div class="modal-overlay" id="globalModal">
                <div class="modal-container">
                    <button class="modal-close" id="modalCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="modal-header">
                        <h2 id="modalTitle">
                            <i class="fas fa-info-circle"></i>
                            <span>Título del Modal</span>
                        </h2>
                    </div>
                    <div class="modal-body" id="modalBody">
                        <p>Contenido del modal...</p>
                    </div>
                    <div class="modal-footer" id="modalFooter">
                        <button class="modal-btn modal-btn-secondary" id="modalCancelBtn">
                            <i class="fas fa-times"></i> Cerrar
                        </button>
                        <a href="#" class="modal-btn modal-btn-primary" id="modalActionBtn">
                            <i class="fas fa-external-link-alt"></i> Ver más
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modalOverlay = document.getElementById('globalModal');
        this.bindEvents();
    }

    bindEvents() {
        if (!this.modalOverlay) return;
        
        // Cerrar con botón X
        const closeBtn = document.getElementById('modalCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // Cerrar con botón Cancelar
        const cancelBtn = document.getElementById('modalCancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.close());
        }
        
        // Cerrar haciendo clic en el overlay (fondo)
        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.close();
            }
        });
        
        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open(options) {
        const {
            title = 'Información',
            icon = 'fas fa-info-circle',
            content = '',
            tags = [],
            image = null,
            imageType = 'icon', // 'icon' o 'img'
            buttons = {
                primary: { text: 'Ver más', link: '#', action: null },
                secondary: { text: 'Cerrar', action: null }
            },
            onOpen = null,
            onClose = null
        } = options;
        
        // Actualizar título con icono
        const titleElement = document.getElementById('modalTitle');
        if (titleElement) {
            titleElement.innerHTML = `<i class="${icon}"></i> <span>${title}</span>`;
        }
        
        // Construir contenido del body
        let bodyHTML = '';
        
        // Agregar imagen si existe
        if (image) {
            if (imageType === 'img') {
                bodyHTML += `<div class="modal-image"><img src="${image}" alt="${title}"></div>`;
            } else {
                bodyHTML += `<div class="modal-image"><i class="${image}"></i></div>`;
            }
        }
        
        // Agregar contenido principal
        bodyHTML += content;
        
        // Agregar tags si existen
        if (tags.length > 0) {
            bodyHTML += `<div class="modal-tags">`;
            tags.forEach(tag => {
                bodyHTML += `<span class="modal-tag">${tag}</span>`;
            });
            bodyHTML += `</div>`;
        }
        
        document.getElementById('modalBody').innerHTML = bodyHTML;
        
        // Configurar botones del footer
        const actionBtn = document.getElementById('modalActionBtn');
        const cancelBtn = document.getElementById('modalCancelBtn');
        
        if (actionBtn) {
            // Configurar botón primario
            if (buttons.primary) {
                actionBtn.innerHTML = `<i class="${buttons.primary.icon || 'fas fa-external-link-alt'}"></i> ${buttons.primary.text}`;
                
                if (buttons.primary.link && buttons.primary.link !== '#') {
                    actionBtn.href = buttons.primary.link;
                    actionBtn.target = buttons.primary.target || '_blank';
                    actionBtn.style.display = 'inline-flex';
                } else if (buttons.primary.action && typeof buttons.primary.action === 'function') {
                    actionBtn.href = 'javascript:void(0)';
                    actionBtn.onclick = (e) => {
                        e.preventDefault();
                        buttons.primary.action();
                    };
                    actionBtn.style.display = 'inline-flex';
                } else {
                    actionBtn.style.display = 'none';
                }
            } else {
                actionBtn.style.display = 'none';
            }
        }
        
        if (cancelBtn && buttons.secondary) {
            if (buttons.secondary.text) {
                cancelBtn.innerHTML = `<i class="${buttons.secondary.icon || 'fas fa-times'}"></i> ${buttons.secondary.text}`;
            }
            if (buttons.secondary.action && typeof buttons.secondary.action === 'function') {
                const newCancelBtn = cancelBtn.cloneNode(true);
                cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
                newCancelBtn.addEventListener('click', (e) => {
                    buttons.secondary.action();
                    this.close();
                });
            }
        }
        
        // Abrir modal
        this.modalOverlay.classList.add('active');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        if (onOpen && typeof onOpen === 'function') {
            onOpen();
        }
        
        // Guardar callback de cierre
        this.onCloseCallback = onClose;
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.modalOverlay.classList.remove('active');
        this.isOpen = false;
        document.body.style.overflow = '';
        
        if (this.onCloseCallback && typeof this.onCloseCallback === 'function') {
            this.onCloseCallback();
            this.onCloseCallback = null;
        }
    }
}

// Inicializar el modal globalmente
const modal = new ModalManager();

// ========== FUNCIONES PARA ABRIR MODALES DESDE CUALQUIER BOTÓN ==========

// Función para abrir modal de proyecto
function abrirModalProyecto(proyectoData) {
    modal.open({
        title: proyectoData.titulo,
        icon: proyectoData.icono || 'fas fa-laptop-code',
        content: `
            <p>${proyectoData.descripcion}</p>
            <h3><i class="fas fa-tasks"></i> Características principales</h3>
            <ul>
                ${proyectoData.caracteristicas.map(c => `<li>${c}</li>`).join('')}
            </ul>
            <h3><i class="fas fa-calendar-alt"></i> Estado del proyecto</h3>
            <p>${proyectoData.estado}</p>
        `,
        tags: proyectoData.tecnologias,
        image: proyectoData.imagen,
        imageType: proyectoData.imageType || 'icon',
        buttons: {
            primary: {
                text: proyectoData.botonTexto || 'Ver proyecto',
                icon: 'fab fa-github',
                link: proyectoData.enlace || '#',
                target: '_blank'
            },
            secondary: {
                text: 'Cerrar',
                icon: 'fas fa-times'
            }
        }
    });
}

// Función para abrir modal de maquetación
function abrirModalMaquetacion(maquetaData) {
    modal.open({
        title: maquetaData.titulo,
        icon: maquetaData.icono || 'fas fa-palette',
        content: `
            <p>${maquetaData.descripcion}</p>
            <h3><i class="fas fa-check-circle"></i> Elementos incluidos</h3>
            <ul>
                ${maquetaData.elementos.map(e => `<li>${e}</li>`).join('')}
            </ul>
            <h3><i class="fas fa-mobile-alt"></i> Responsive</h3>
            <p>${maquetaData.responsive}</p>
        `,
        tags: maquetaData.herramientas,
        image: maquetaData.imagen,
        imageType: maquetaData.imageType || 'icon',
        buttons: {
            primary: {
                text: 'Ver maqueta',
                icon: 'fas fa-eye',
                link: maquetaData.enlace || '#',
                target: '_blank'
            },
            secondary: {
                text: 'Cerrar'
            }
        }
    });
}

// Función para abrir modal de contacto/confirmación
function abrirModalContacto(mensaje, tipo = 'info') {
    const colores = {
        success: { icon: 'fas fa-check-circle', title: '¡Mensaje enviado!' },
        error: { icon: 'fas fa-exclamation-triangle', title: 'Error' },
        info: { icon: 'fas fa-info-circle', title: 'Información' }
    };
    
    modal.open({
        title: colores[tipo].title,
        icon: colores[tipo].icon,
        content: `<p style="font-size: 16px; text-align: center;">${mensaje}</p>`,
        buttons: {
            primary: null,
            secondary: { text: 'Cerrar', icon: 'fas fa-check' }
        }
    });
}

// Exportar para uso global (opcional)
window.modal = modal;
window.abrirModalProyecto = abrirModalProyecto;
window.abrirModalMaquetacion = abrirModalMaquetacion;
window.abrirModalContacto = abrirModalContacto;

console.log('✅ Modal cargado correctamente');