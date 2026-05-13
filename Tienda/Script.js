// ========== HISTORIAL DE COMPRAS ==========
let purchaseHistory = [];

function loadHistoryFromLocal() {
    const stored = localStorage.getItem('modaStyleHistory');
    if (stored) {
        try {
            purchaseHistory = JSON.parse(stored);
        } catch(e) { console.warn(e); }
    }
    if (!purchaseHistory) purchaseHistory = [];
}

function saveHistoryToLocal() {
    localStorage.setItem('modaStyleHistory', JSON.stringify(purchaseHistory));
}

function addToHistory(cartItems, totalAmount, paymentMethod) {
    const now = new Date();
    const formattedDate = now.toLocaleString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const order = {
        id: Date.now(),
        date: formattedDate,
        timestamp: now.getTime(),
        items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            icon: item.icon,
            subtotal: item.price * item.quantity
        })),
        total: totalAmount,
        paymentMethod: paymentMethod,
        status: 'Completado'
    };
    
    purchaseHistory.unshift(order); // Los más recientes primero
    saveHistoryToLocal();
    renderHistory();
}

function renderHistory() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    if (purchaseHistory.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-history">
                <i class="fas fa-shopping-bag"></i>
                <p>Aún no has realizado ninguna compra</p>
                <small>¡Tus pedidos aparecerán aquí después de completar una compra!</small>
            </div>
        `;
        return;
    }
    
    historyContainer.innerHTML = purchaseHistory.map(order => `
        <div class="history-item">
            <div class="history-header">
                <div class="history-date">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${order.date}</span>
                </div>
                <div class="history-total">
                    <i class="fas fa-tag"></i> Total: $${order.total.toFixed(2)}
                </div>
                <div class="history-payment">
                    <i class="fas fa-credit-card"></i>
                    <span>${order.paymentMethod}</span>
                </div>
                <div class="history-status">
                    <i class="fas fa-check-circle"></i> ${order.status}
                </div>
            </div>
            <div class="history-products">
                ${order.items.map(item => `
                    <div class="history-product-item">
                        <div class="history-product-name">
                            <span>${item.icon}</span>
                            <span>${item.name}</span>
                        </div>
                        <div class="history-product-detail">
                            ${item.quantity} x $${item.price.toFixed(2)}
                        </div>
                        <div class="history-product-subtotal">
                            $${item.subtotal.toFixed(2)}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// ========== MODAL DEL HISTORIAL ==========
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');

if (historyBtn) {
    historyBtn.addEventListener('click', () => {
        renderHistory();
        historyModal.classList.add('open');
    });
}

if (closeHistoryBtn) {
    closeHistoryBtn.addEventListener('click', () => {
        historyModal.classList.remove('open');
    });
}

historyModal.addEventListener('click', (e) => {
    if (e.target === historyModal) {
        historyModal.classList.remove('open');
    }
});


// ========== CONFIGURACIÓN DE WHATSAPP ==========
const OWNER_WHATSAPP_NUMBER = "966712896"; // <--- NÚMERO DEL DUEÑO (recibe pedidos)
const SUPPORT_WHATSAPP_NUMBER = "966712896"; // <--- NÚMERO DE ATENCIÓN AL CLIENTE
const SUPPORT_MESSAGE = "Hola muy buenas quisiera mas informacion";

function getSupportWhatsAppLink() {
    const encodedMessage = encodeURIComponent(SUPPORT_MESSAGE);
    return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

function setupWhatsAppFloat() {
    const whatsappBtn = document.getElementById('whatsappFloat');
    if (whatsappBtn) {
        whatsappBtn.href = getSupportWhatsAppLink();
        whatsappBtn.setAttribute('target', '_blank');
        whatsappBtn.setAttribute('rel', 'noopener noreferrer');
    }
}

// ========== CONFIGURACIÓN DE REDES SOCIALES ==========
// Coloca aquí tus enlaces reales de redes sociales
const SOCIAL_LINKS = {
    tiktok: "https://www.tiktok.com/@jair_ap_25?_r=1&_t=ZS-968vexitYci",      // <--- CAMBIA POR TU LINK DE TIKTOK
    facebook: "https://www.facebook.com/share/1D1ftQChBF/",   // <--- CAMBIA POR TU LINK DE FACEBOOK
    instagram: "https://www.instagram.com/jair_ap_25?igsh=MXhjbXZnMTIycDc2bQ==" // <--- CAMBIA POR TU LINK DE INSTAGRAM
};

function setupSocialLinks() {
    const tiktokLink = document.getElementById('tiktokLink');
    const facebookLink = document.getElementById('facebookLink');
    const instagramLink = document.getElementById('instagramLink');
    
    if (tiktokLink) tiktokLink.href = SOCIAL_LINKS.tiktok;
    if (facebookLink) facebookLink.href = SOCIAL_LINKS.facebook;
    if (instagramLink) instagramLink.href = SOCIAL_LINKS.instagram;
}

// ========== CHATBOT INTELIGENTE (solo preguntas de la tienda) ==========
// Base de conocimiento del chatbot
const chatbotKnowledge = {
    // Métodos de pago
    "metodos de pago": "Aceptamos múltiples métodos de pago: 💳 Tarjeta de crédito/débito, PayPal, Transferencia bancaria, Efectivo contraentrega y Mercado Pago. Puedes seleccionar tu método favorito en el carrito antes de pagar.",
    "pago": "Ofrecemos pagos seguros con tarjeta, PayPal, transferencia, efectivo contraentrega y Mercado Pago. Todos los métodos son confiables y rápidos.",
    "tarjeta": "Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express). El pago es 100% seguro.",
    "paypal": "Sí, aceptamos PayPal como método de pago. Es rápido y seguro.",
    "contraentrega": "El pago contraentrega está disponible. Pagas en efectivo al recibir tu pedido. Aplica solo para ciertas zonas.",
    "mercado pago": "Aceptamos Mercado Pago, puedes pagar con saldo, tarjeta o código QR.",
    
    // Envíos
    "envio": "Realizamos envíos a todo el país. El tiempo de entrega es de 3 a 7 días hábiles. Los envíos son gratuitos en compras mayores a $50.",
    "envios": "Los envíos tardan entre 3 y 7 días hábiles. Tenemos seguimiento online. Envíos gratis desde $50.",
    "tiempo de envio": "El tiempo estimado es de 3 a 7 días hábiles dependiendo de tu ubicación.",
    "gratis": "Sí, ofrecemos envío gratis en compras superiores a $50.",
    
    // Garantía y cambios
    "garantia": "Todos nuestros productos tienen garantía de 30 días por defectos de fábrica. Si tienes algún problema, contáctanos.",
    "cambios": "Aceptamos cambios dentro de los 15 días posteriores a la compra. El producto debe estar en su empaque original y sin uso.",
    "devoluciones": "Puedes devolver un producto dentro de los 15 días si no estás satisfecho. Te reembolsamos el 100% del valor.",
    
    // Productos
    "productos": "Vendemos ropa moderna (camisas, jeans, vestidos, chaquetas) y accesorios (collares, pulseras, relojes, anillos, gafas, sombreros, cinturones).",
    "ropa": "Ofrecemos camisas oversize, jeans rectos, vestidos florales, chaquetas de cuero ecológico, bufandas y más. Todos de alta calidad.",
    "accesorios": "Tenemos collares minimalistas, pulseras de acero, relojes clásicos, anillos ajustables, gafas de sol, set de pulseras, collares de perla, sombreros, cinturones y más.",
    "precios": "Nuestros precios son muy competitivos. Desde $12.99 hasta $89.99. Hay opciones para todos los presupuestos.",
    "tallas": "Manejamos tallas S, M, L, XL en la mayoría de la ropa. Si necesitas una talla específica, escríbenos.",
    
    // Horarios y contacto
    "horario": "Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 horas. Fines de semana atención por chat.",
    "contacto": "Puedes contactarnos por WhatsApp en el botón verde de la esquina inferior derecha, o por nuestro chat en la tienda.",
    
    // Personalizado
    "hola": "¡Hola! Bienvenido a ModaStyle. ¿En qué puedo ayudarte? Puedo informarte sobre productos, pagos, envíos, garantías y más.",
    "gracias": "¡De nada! Estamos para servirte. Si tienes más preguntas, no dudes en hacerlas.",
    "como estas": "¡Estoy muy bien! Listo para ayudarte con tu experiencia de compra en ModaStyle.",
    "ayuda": "Claro, puedo ayudarte con información sobre ropa, accesorios, métodos de pago, envíos, garantías y cambios. ¿Qué te gustaría saber?",
    "catalogo": "Puedes ver todo nuestro catálogo arriba, filtrando por 'Ropa' o 'Accesorios'. Tenemos prendas y accesorios muy bonitos."
};

// Función para buscar respuesta en el conocimiento del chatbot
function getBotResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase().trim();
    
    // Buscar coincidencia exacta o parcial en las claves
    for (const [key, response] of Object.entries(chatbotKnowledge)) {
        if (lowerMsg.includes(key) || key.includes(lowerMsg)) {
            return response;
        }
    }
    
    // Si no encuentra, respuesta por defecto relacionada a la tienda
    return "Lo siento, no entendí tu pregunta. 😊 Por favor, intenta preguntar sobre: métodos de pago, envíos, garantía, cambios, productos (ropa o accesorios), precios, tallas, horarios o contacto. ¡Estoy aquí para ayudarte con tu compra en ModaStyle!";
}

// DOM elementos del chatbot
const chatbotFloat = document.getElementById('chatbotFloat');
const chatbotModal = document.getElementById('chatbotModal');
const closeChatbotBtn = document.getElementById('closeChatbotBtn');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotInput = document.getElementById('chatbotInput');
const sendChatbotMsg = document.getElementById('sendChatbotMsg');

// Abrir/cerrar chatbot
chatbotFloat.addEventListener('click', () => {
    chatbotModal.classList.toggle('open');
    if (chatbotModal.classList.contains('open')) {
        chatbotInput.focus();
        // Scroll al último mensaje
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});

closeChatbotBtn.addEventListener('click', () => {
    chatbotModal.classList.remove('open');
});

// Cerrar al hacer clic fuera (opcional)
document.addEventListener('click', (e) => {
    if (!chatbotModal.contains(e.target) && !chatbotFloat.contains(e.target) && chatbotModal.classList.contains('open')) {
        chatbotModal.classList.remove('open');
    }
});

// Agregar mensaje al chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isUser ? 'user-message' : 'bot-message';
    
    if (isUser) {
        messageDiv.innerHTML = `<span>${escapeHtml(text)}</span>`;
    } else {
        messageDiv.innerHTML = `<i class="fas fa-robot"></i><span>${escapeHtml(text)}</span>`;
    }
    
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Escapar HTML para seguridad
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Enviar mensaje del usuario y obtener respuesta del bot
function sendUserMessage() {
    const message = chatbotInput.value.trim();
    if (message === "") return;
    
    // Mostrar mensaje del usuario
    addMessage(message, true);
    chatbotInput.value = "";
    
    // Mostrar indicador de "escribiendo" (opcional)
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `<i class="fas fa-robot"></i><span>✍️ Escribiendo...</span>`;
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Simular tiempo de respuesta (más realista)
    setTimeout(() => {
        // Eliminar indicador de escritura
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
        
        // Obtener respuesta del bot
        const botResponse = getBotResponse(message);
        addMessage(botResponse, false);
    }, 500);
}

// Eventos del chatbot
sendChatbotMsg.addEventListener('click', sendUserMessage);
chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendUserMessage();
});

// Botones de sugerencias
document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        chatbotInput.value = btn.textContent;
        sendUserMessage();
    });
});

// ========== ENVÍO DE PEDIDO AL DUEÑO ==========
function sendOrderToOwner(cartItems, totalAmount, paymentMethod) {
    let orderDetails = "🛍️ *NUEVO PEDIDO RECIBIDO* 🛍️\n\n";
    orderDetails += `📦 *DETALLE DEL PEDIDO:*\n`;
    orderDetails += `──────────────────\n`;
    
    cartItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        orderDetails += `${index + 1}. ${item.name} (${item.icon})\n`;
        orderDetails += `   Cantidad: ${item.quantity} x $${item.price.toFixed(2)} = $${subtotal.toFixed(2)}\n`;
    });
    
    orderDetails += `──────────────────\n`;
    orderDetails += `💰 *TOTAL: $${totalAmount.toFixed(2)}*\n`;
    orderDetails += `💳 *Método de pago:* ${paymentMethod}\n`;
    orderDetails += `──────────────────\n`;
    orderDetails += `✅ ¡Cliente ha completado la compra correctamente!\n`;
    orderDetails += `📱 Enviado automáticamente desde la tienda ModaStyle.`;
    
    const encodedMessage = encodeURIComponent(orderDetails);
    const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// ========== PRODUCTOS ==========
const products = [
    { id: 1, name: "Camisa Oversize Blanca", category: "ropa", price: 29.99, icon: "👕", stock: true },
    { id: 2, name: "Jeans Rectos Denim", category: "ropa", price: 49.99, icon: "👖", stock: true },
    { id: 3, name: "Vestido Floral Verano", category: "ropa", price: 39.99, icon: "👗", stock: true },
    { id: 4, name: "Chaqueta Cuero Eco", category: "ropa", price: 89.99, icon: "🧥", stock: true },
    { id: 5, name: "Collar de Luna Minimalista", category: "accesorios", price: 19.99, icon: "📿", stock: true },
    { id: 6, name: "Pulsera Acero Inoxidable", category: "accesorios", price: 14.99, icon: "🔗", stock: true },
    { id: 7, name: "Reloj Analógico Clásico", category: "accesorios", price: 54.99, icon: "⌚", stock: true },
    { id: 8, name: "Anillo Ajustable Plata", category: "accesorios", price: 12.99, icon: "💍", stock: true },
    { id: 9, name: "Gafas de Sol Polarizado", category: "accesorios", price: 34.99, icon: "🕶️", stock: true },
    { id: 10, name: "Set de Pulseras Hilo", category: "accesorios", price: 22.99, icon: "🧵", stock: true },
    { id: 11, name: "Collar Perla Moderno", category: "accesorios", price: 27.99, icon: "✨", stock: true },
    { id: 12, name: "Sombrero Playa", category: "accesorios", price: 24.99, icon: "🧢", stock: true },
    { id: 13, name: "Bufanda de Lana", category: "ropa", price: 18.99, icon: "🧣", stock: true },
    { id: 14, name: "Cinturón Cuero", category: "accesorios", price: 29.99, icon: "⛓️", stock: true }
];

let cart = [];
const productsGrid = document.getElementById('productsGrid');
const cartCountSpan = document.getElementById('cartCount');
const cartIconBtn = document.getElementById('cartIcon');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotalAmountSpan = document.getElementById('cartTotalAmount');
const checkoutBtn = document.getElementById('checkoutBtn');
const paymentMethodsContainer = document.getElementById('paymentMethodsContainer');

let activeCategory = 'all';
let selectedPaymentMethod = null;

function saveCartToLocal() { localStorage.setItem('modaStyleCart', JSON.stringify(cart)); }
function loadCartFromLocal() {
    const stored = localStorage.getItem('modaStyleCart');
    if (stored) { try { cart = JSON.parse(stored); } catch(e) {} }
    updateCartUI();
}

function showToast(msg) {
    let toast = document.createElement('div');
    toast.innerText = msg;
    toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1f2e4a;color:white;padding:10px 20px;border-radius:40px;z-index:999;font-weight:500';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    existing ? existing.quantity++ : cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1, icon: product.icon });
    saveCartToLocal();
    updateCartUI();
    showToast(`✅ ${product.name} añadido`);
}

function changeQuantity(id, delta) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        const newQty = cart[index].quantity + delta;
        newQty <= 0 ? cart.splice(index, 1) : cart[index].quantity = newQty;
        updateCartUI();
    }
}

function removeItemCompletely(id) { cart = cart.filter(item => item.id !== id); updateCartUI(); }

function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartCountSpan.innerText = totalItems;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart-msg">🛒 Aún no hay productos. ¡Agrega algo cool!</div>`;
        cartTotalAmountSpan.innerText = `$0.00`;
    } else {
        let itemsHtml = '', total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            itemsHtml += `<div class="cart-item" data-id="${item.id}"><div class="cart-item-img">${item.icon}</div><div class="cart-item-details"><div class="cart-item-title">${item.name}</div><div class="cart-item-price">$${item.price.toFixed(2)}</div><div class="cart-item-qty"><button class="qty-btn dec-qty" data-id="${item.id}">-</button><span>${item.quantity}</span><button class="qty-btn inc-qty" data-id="${item.id}">+</button><button class="remove-item" data-id="${item.id}"><i class="fas fa-trash-alt"></i> Eliminar</button></div></div></div>`;
        });
        cartItemsContainer.innerHTML = itemsHtml;
        cartTotalAmountSpan.innerText = `$${total.toFixed(2)}`;
        document.querySelectorAll('.inc-qty').forEach(btn => btn.addEventListener('click', () => changeQuantity(parseInt(btn.dataset.id), 1)));
        document.querySelectorAll('.dec-qty').forEach(btn => btn.addEventListener('click', () => changeQuantity(parseInt(btn.dataset.id), -1)));
        document.querySelectorAll('.remove-item').forEach(btn => btn.addEventListener('click', () => removeItemCompletely(parseInt(btn.dataset.id))));
    }
    saveCartToLocal();
}

function clearCart() {
    if (cart.length && confirm('¿Cancelar todo? Se vaciará completamente el carrito.')) {
        cart = [];
        updateCartUI();
        showToast("🧹 Carrito vaciado");
    }
}

function renderProducts() {
    let filtered = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);
    productsGrid.innerHTML = '';
    filtered.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `<div class="product-img">${prod.icon}</div><div class="product-info"><div class="product-title">${prod.name}</div><div class="product-category">${prod.category === 'ropa' ? '👚 Ropa' : '✨ Accesorio'}</div><div class="product-price">$${prod.price.toFixed(2)}</div><button class="add-to-cart" data-id="${prod.id}"><i class="fas fa-cart-plus"></i> Agregar</button></div>`;
        productsGrid.appendChild(card);
        card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(prod));
    });
}

function setupPaymentMethods() {
    const methods = [
        { name: "Tarjeta crédito/débito", icon: "fa-credit-card", value: "card" },
        { name: "PayPal", icon: "fa-paypal", value: "paypal" },
        { name: "Transferencia bancaria", icon: "fa-university", value: "bank" },
        { name: "Efectivo contraentrega", icon: "fa-money-bill-wave", value: "cash" },
        { name: "Mercado Pago", icon: "fa-arrow-right-arrow-left", value: "mercadopago" }
    ];
    paymentMethodsContainer.innerHTML = '';
    methods.forEach(m => {
        const btn = document.createElement('button');
        btn.className = 'pay-btn';
        btn.innerHTML = `<i class="fab ${m.icon}"></i> ${m.name}`;
        btn.addEventListener('click', () => {
            if (cart.length === 0) return showToast("❗ El carrito está vacío, agrega productos primero.");
            selectedPaymentMethod = m.name;
            showToast(`💳 Método seleccionado: ${m.name}. Luego presiona "Proceder a pagar".`);
        });
        paymentMethodsContainer.appendChild(btn);
    });
}

function setupCheckout() {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return showToast("🛑 No hay productos en el carrito.");
        if (!selectedPaymentMethod) return showToast("⚠️ Por favor selecciona un método de pago.");
        const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        if (confirm(`🛍️ Confirmar compra por $${total.toFixed(2)}\nMétodo: ${selectedPaymentMethod}\n¿Deseas proceder?`)) {
            sendOrderToOwner(cart, total, selectedPaymentMethod);
            alert(`🎉 ¡Compra exitosa! Gracias por tu pedido. Se ha notificado al vendedor.`);
            cart = [];
            updateCartUI();
            selectedPaymentMethod = null;
            cartOverlay.classList.remove('open');
        } else {
            showToast("❌ Has cancelado el proceso de pago.");
        }
    });
}

function addClearCartButton() {
    const cartTotalDiv = document.querySelector('.cart-total');
    if (!document.getElementById('clearCartBtn')) {
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearCartBtn';
        clearBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Vaciar carrito';
        clearBtn.addEventListener('click', clearCart);
        cartTotalDiv.appendChild(clearBtn);
    }
}

function bindEvents() {
    cartIconBtn.addEventListener('click', () => cartOverlay.classList.add('open'));
    closeCartBtn.addEventListener('click', () => cartOverlay.classList.remove('open'));
    cartOverlay.addEventListener('click', (e) => { if (e.target === cartOverlay) cartOverlay.classList.remove('open'); });
    document.querySelectorAll('.cat-btn').forEach(btn => btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        renderProducts();
    }));
}

function init() {
    loadHistoryFromLocal();
    loadCartFromLocal();
    renderProducts();
    setupPaymentMethods();
    setupCheckout();
    bindEvents();
    addClearCartButton();
    setupWhatsAppFloat();
    setupSocialLinks();
    renderHistory();
}
init();