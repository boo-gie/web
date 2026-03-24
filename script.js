/* ============================================================
   BOO-GIE — SCRIPT COMPLET ET FONCTIONNEL
   Version simplifiée - Tout en un fichier
   ============================================================ */

// Configuration des données
const PRODUCTS = [
    { id: "p1", name: "nounours", price: 800, img: "bougie-B.jpeg", desc: "Bougie nounours", category: "bougie" },
    { id: "p2", name: "noeud", price: 1200, img: "bougie-R.jpeg", desc: "Bougie noeud", category: "bougie" },
    { id: "p3", name: "tulips", price: 800, img: "bougie-V.jpeg", desc: "Parcelle tulips", category: "parcelle" },
    { id: "p4", name: "bubble 8", price: 440, img: "candle1.jpeg", desc: "Bougie bubble 8", category: "bougie" },
    { id: "p5", name: "rose", price: 4500, img: "pack 5 couleurs (3).jpeg", desc: "Pack rose", category: "propriete" },
    { id: "p6", name: "mini rose", price: 800, img: "pack bleu.png", desc: "Mini rose", category: "bougie" },
    { id: "p7", name: "fleur", price: 2000, img: "pack boy-girl.jpeg", desc: "Bougie fleur", category: "propriete" },
    { id: "p8", name: "heart cake", price: 1200, img: "pack rouge.jpeg", desc: "Heart cake", category: "parcelle" },
    { id: "p9", name: "bubble 27", price: 800, img: "pack vert.jpeg", desc: "Bubble 27", category: "bougie" }
];

const GALLERY = [
    "img/bougie-B.jpeg", "img/bougie-R.jpeg", "img/bougie-V.jpeg", "img/candle1.jpeg",
    "img/candle2.jpeg", "img/commande1.jpeg", "img/pack bleu.png", "img/pack rouge.jpeg",
    "img/pack vert.jpeg", "img/pack2.jpeg"
];

const AVAILABLE_COLORS = [
    { name: "Rose", code: "#b72a52" },
    { name: "Vert", code: "#0a5c38" },
    { name: "Rouge", code: "#7a0f1e" },
    { name: "Bleu", code: "#123a6f" },
    { name: "Blanc", code: "#FFFFFF" },
    { name: "Violet", code: "#4b1e6d" }
];

const AVAILABLE_PARFUMS = ["Vanille", "Jasmin", "Musc", "Framboise"];

// Variables globales
let cart = JSON.parse(localStorage.getItem("boogie_cart")) || [];
let selectedColors = [];
let currentLightboxIndex = 0;

// ==================== FONCTIONS UTILITAIRES ====================
function formatPrice(price) {
    return price.toLocaleString("fr-FR") + " DA";
}

function saveCart() {
    localStorage.setItem("boogie_cart", JSON.stringify(cart));
    updateCartUI();
}

function showToast(message) {
    const toast = document.getElementById("cart-toast");
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add("show");
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

function getProductById(id) {
    return PRODUCTS.find(p => p.id === id);
}

// ==================== AFFICHAGE DES PRODUITS ====================
function renderProducts(category = "all") {
    const productsGrid = document.getElementById("products");
    if (!productsGrid) return;
    
    productsGrid.innerHTML = "";
    
    const filteredProducts = category === "all" 
        ? PRODUCTS 
        : PRODUCTS.filter(p => p.category === category);
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted)">Aucun produit dans cette catégorie</div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}" loading="lazy" onerror="this.src='boo-gie-logo.png'">
            <h4>${product.name}</h4>
            <div class="small">${product.desc}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:15px">
                <div class="price">${formatPrice(product.price)}</div>
                <div class="actions">
                    <button class="btn ghost view-btn" data-img="${product.img}">Voir</button>
                    <button class="btn add-btn" data-id="${product.id}">Ajouter</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productDiv);
    });
    
    // Ajouter les événements après le rendu
    setTimeout(() => {
        document.querySelectorAll(".add-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const productId = this.getAttribute("data-id");
                addToCart(productId);
            });
        });
        
        document.querySelectorAll(".view-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const imgSrc = this.getAttribute("data-img");
                openLightboxBySrc(imgSrc);
            });
        });
    }, 100);
}

// ==================== GESTION DU PANIER ====================
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId && !item.isCustom);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            isCustom: false
        });
    }
    
    saveCart();
    showToast("✨ Produit ajouté au panier !");
}

function updateCartUI() {
    // Mettre à jour le compteur
    const cartCount = document.getElementById("cart-count");
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    
    // Mettre à jour la liste
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    
    if (!cartItems || !cartTotal) return;
    
    cartItems.innerHTML = "";
    let totalPrice = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div style="text-align:center;padding:40px;color:var(--muted)">Votre panier est vide</div>';
        cartTotal.textContent = "0,00 DA";
        return;
    }
    
    cart.forEach((item, index) => {
        totalPrice += item.price * item.quantity;
        
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <img src="${item.img}" alt="${item.name}" onerror="this.src='boo-gie-logo.png'">
            <div style="flex:1">
                <div style="font-weight:700">${item.name}</div>
                <div class="small">${formatPrice(item.price)} × ${item.quantity}</div>
                ${item.details ? `<div class="small" style="color:var(--pink)">${item.details}</div>` : ''}
                ${item.customMessage ? `<div class="small" style="color:var(--brown)">Note: ${item.customMessage}</div>` : ''}
            </div>
            <div style="display:flex;flex-direction:column;gap:5px;">
                <button class="btn qty-btn" data-index="${index}" data-action="increase">+</button>
                <button class="btn ghost qty-btn" data-index="${index}" data-action="decrease">-</button>
            </div>
        `;
        cartItems.appendChild(itemDiv);
    });
    
    cartTotal.textContent = formatPrice(totalPrice);
    
    // Ajouter les événements pour les boutons quantité
    setTimeout(() => {
        document.querySelectorAll(".qty-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                const action = this.getAttribute("data-action");
                
                if (action === "increase") {
                    cart[index].quantity += 1;
                } else if (action === "decrease") {
                    cart[index].quantity -= 1;
                    if (cart[index].quantity <= 0) {
                        cart.splice(index, 1);
                    }
                }
                
                saveCart();
            });
        });
    }, 100);
}

// ==================== PERSONNALISATION ====================
function initCustomizer() {
    // Remplir les couleurs
    const colorGrid = document.getElementById("color-options");
    if (colorGrid) {
        colorGrid.innerHTML = AVAILABLE_COLORS.map(color => `
            <div class="color-box" style="background-color:${color.code}" 
                 data-name="${color.name}" 
                 title="${color.name}"></div>
        `).join("");
        
        // Événements pour les couleurs
        document.querySelectorAll(".color-box").forEach(box => {
            box.addEventListener("click", function() {
                this.classList.toggle("selected");
                updatePreview();
            });
        });
    }
    
    // Remplir les modèles
    const modelSelect = document.getElementById("custom-modele");
    if (modelSelect) {
        modelSelect.innerHTML = '<option value="">-- Modèle --</option>' +
            PRODUCTS.map(p => `
                <option value="${p.name}" data-price="${p.price}" data-img="${p.img}">
                    ${p.name} (${formatPrice(p.price)})
                </option>
            `).join("");
        
        modelSelect.addEventListener("change", updatePreview);
    }
    
    // Écouteur pour le parfum
    document.getElementById("custom-parfum")?.addEventListener("change", updatePreview);
    
    // Écouteur pour la quantité
    document.getElementById("custom-qty")?.addEventListener("change", updatePreview);
}

function updatePreview() {
    // Mettre à jour les couleurs sélectionnées
    selectedColors = [];
    document.querySelectorAll(".color-box.selected").forEach(box => {
        selectedColors.push(box.getAttribute("data-name"));
    });
    
    // Mettre à jour les infos
    const parfum = document.getElementById("custom-parfum").value;
    const modelSelect = document.getElementById("custom-modele");
    const model = modelSelect.value;
    const selectedOption = modelSelect.options[modelSelect.selectedIndex];
    
    // Afficher les infos
    document.getElementById("preview-parfum").textContent = `Parfum: ${parfum || "—"}`;
    document.getElementById("preview-modele").textContent = `Modèle: ${model || "—"}`;
    document.getElementById("preview-couleur").textContent = `Couleurs: ${selectedColors.join(", ") || "—"}`;
    
    // Mettre à jour le prix
    if (selectedOption && selectedOption.dataset.price) {
        const price = parseInt(selectedOption.dataset.price);
        document.getElementById("custom-price").textContent = formatPrice(price);
        
        // Mettre à jour l'image
        const imgSrc = selectedOption.dataset.img;
        const previewImg = document.getElementById("preview-img");
        const emojiFallback = document.getElementById("emoji-fallback");
        
        if (imgSrc) {
            previewImg.src = imgSrc;
            previewImg.style.display = "block";
            emojiFallback.style.display = "none";
        } else {
            previewImg.style.display = "none";
            emojiFallback.style.display = "block";
        }
    } else {
        document.getElementById("custom-price").textContent = "0 DA";
        document.getElementById("preview-img").style.display = "none";
        document.getElementById("emoji-fallback").style.display = "block";
    }
}

function addCustomToCart() {
    const parfum = document.getElementById("custom-parfum").value;
    const model = document.getElementById("custom-modele").value;
    const quantity = parseInt(document.getElementById("custom-qty").value) || 1;
    const message = document.getElementById("custom-message").value;
    const modelSelect = document.getElementById("custom-modele");
    const selectedOption = modelSelect.options[modelSelect.selectedIndex];
    
    // Validation
    if (!parfum || !model || selectedColors.length === 0) {
        alert("Veuillez sélectionner un parfum, un modèle et au moins une couleur.");
        return;
    }
    
    if (!selectedOption || !selectedOption.dataset.price) {
        alert("Veuillez sélectionner un modèle valide.");
        return;
    }
    
    const price = parseInt(selectedOption.dataset.price);
    const img = selectedOption.dataset.img || "boo-gie-logo.png";
    
    // Ajouter au panier
    cart.push({
        id: "custom_" + Date.now(),
        name: `Bougie Perso: ${model}`,
        price: price,
        img: img,
        quantity: quantity,
        isCustom: true,
        details: `Parfum: ${parfum} | Couleurs: ${selectedColors.join(", ")}`,
        customMessage: message
    });
    
    saveCart();
    
    // Fermer le modal et réinitialiser
    document.getElementById("custom-modal").classList.remove("open");
    document.getElementById("custom-form").reset();
    selectedColors = [];
    document.querySelectorAll(".color-box.selected").forEach(box => {
        box.classList.remove("selected");
    });
    updatePreview();
    
    showToast("🎨 Bougie personnalisée ajoutée !");
}

// ==================== GALERIE & LIGHTBOX ====================
function renderGallery() {
    const galleryGrid = document.getElementById("gallery-grid");
    const miniGallery = document.getElementById("mini-gallery");
    
    if (galleryGrid) {
        galleryGrid.innerHTML = GALLERY.map((src, index) => `
            <img src="${src}" alt="Galerie ${index + 1}" loading="lazy" 
                 onerror="this.src='boo-gie-logo.png'" 
                 data-index="${index}">
        `).join("");
        
        // Ajouter les événements
        setTimeout(() => {
            document.querySelectorAll("#gallery-grid img").forEach(img => {
                img.addEventListener("click", function() {
                    const index = parseInt(this.getAttribute("data-index"));
                    openLightbox(index);
                });
            });
        }, 100);
    }
    
    if (miniGallery) {
        miniGallery.innerHTML = GALLERY.slice(0, 4).map((src, index) => `
            <img src="${src}" alt="Mini galerie" loading="lazy"
                 onerror="this.src='boo-gie-logo.png'"
                 data-index="${index}"
                 style="width:70px;height:70px;object-fit:cover;border-radius:8px;cursor:pointer">
        `).join("");
        
        // Ajouter les événements
        setTimeout(() => {
            document.querySelectorAll("#mini-gallery img").forEach(img => {
                img.addEventListener("click", function() {
                    const index = parseInt(this.getAttribute("data-index"));
                    openLightbox(index);
                });
            });
        }, 100);
    }
}

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lb-img");
    const caption = document.getElementById("lb-caption");
    
    if (!lightbox || !lightboxImg) return;
    
    lightboxImg.src = GALLERY[index];
    caption.textContent = `Image ${index + 1} sur ${GALLERY.length}`;
    lightbox.classList.add("open");
}

function openLightboxBySrc(src) {
    const index = GALLERY.indexOf(src);
    if (index >= 0) {
        openLightbox(index);
    } else {
        // Si l'image n'est pas dans la galerie, l'afficher quand même
        const lightbox = document.getElementById("lightbox");
        const lightboxImg = document.getElementById("lb-img");
        const caption = document.getElementById("lb-caption");
        
        if (!lightbox || !lightboxImg) return;
        
        lightboxImg.src = src;
        caption.textContent = "Vue du produit";
        lightbox.classList.add("open");
    }
}

// ==================== COMMANDE ====================
function setupOrderForm() {
    const deliveryChoice = document.getElementById("delivery-choice");
    const addrLabel = document.getElementById("addr-label");
    
    if (deliveryChoice && addrLabel) {
        deliveryChoice.addEventListener("change", function() {
            addrLabel.style.display = this.value === "domicile" ? "block" : "none";
        });
    }
    
    const orderForm = document.getElementById("final-checkout-form");
    if (orderForm) {
        orderForm.addEventListener("submit", function() {
            // Préparer les données pour le mail
            const itemsList = cart.map(item => {
                let details = "";
                if (item.details) details += ` [${item.details}]`;
                if (item.customMessage) details += ` (Note: ${item.customMessage})`;
                return `- ${item.name} x${item.quantity} : ${formatPrice(item.price * item.quantity)}${details}`;
            }).join("\n");
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            document.getElementById("hidden-cart-list").value = itemsList;
            document.getElementById("hidden-total-val").value = formatPrice(total);
            
            // Vider le panier après envoi
            setTimeout(() => {
                cart = [];
                saveCart();
                showToast("✅ Commande envoyée avec succès !");
            }, 1000);
        });
    }
}

// ==================== ÉVÉNEMENTS PRINCIPAUX ====================
function setupEventListeners() {
    // Navigation
    document.getElementById("open-cart")?.addEventListener("click", () => {
        document.getElementById("cart-panel").classList.add("open");
    });
    
    document.getElementById("close-cart")?.addEventListener("click", () => {
        document.getElementById("cart-panel").classList.remove("open");
    });
    
    document.getElementById("floating-cart-btn")?.addEventListener("click", () => {
        document.getElementById("cart-panel").classList.add("open");
    });
    
    // Personnalisation
    document.getElementById("open-custom-btn")?.addEventListener("click", () => {
        document.getElementById("custom-modal").classList.add("open");
    });
    
    document.getElementById("close-custom")?.addEventListener("click", () => {
        document.getElementById("custom-modal").classList.remove("open");
    });
    
    document.getElementById("cancel-custom")?.addEventListener("click", () => {
        document.getElementById("custom-modal").classList.remove("open");
    });
    
    document.getElementById("add-custom-to-cart")?.addEventListener("click", addCustomToCart);
    
    // Commande
    document.getElementById("confirm-order-btn")?.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Votre panier est vide !");
            return;
        }
        document.getElementById("cart-panel").classList.remove("open");
        document.getElementById("order-modal").classList.add("open");
    });
    
    document.getElementById("close-order-modal")?.addEventListener("click", () => {
        document.getElementById("order-modal").classList.remove("open");
    });
    
    // Vider le panier
    document.getElementById("clear-cart")?.addEventListener("click", () => {
        if (cart.length === 0) return;
        if (confirm("Voulez-vous vraiment vider votre panier ?")) {
            cart = [];
            saveCart();
            showToast("🛒 Panier vidé");
        }
    });
    
    // Filtres
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelector(".filter-btn.active")?.classList.remove("active");
            this.classList.add("active");
            const category = this.getAttribute("data-category");
            renderProducts(category);
        });
    });
    
    // Lightbox
    document.getElementById("lb-close")?.addEventListener("click", () => {
        document.getElementById("lightbox").classList.remove("open");
    });
    
    document.getElementById("lb-prev")?.addEventListener("click", () => {
        currentLightboxIndex = (currentLightboxIndex - 1 + GALLERY.length) % GALLERY.length;
        openLightbox(currentLightboxIndex);
    });
    
    document.getElementById("lb-next")?.addEventListener("click", () => {
        currentLightboxIndex = (currentLightboxIndex + 1) % GALLERY.length;
        openLightbox(currentLightboxIndex);
    });
    
    // Menu flottant
    document.getElementById("float-main-btn")?.addEventListener("click", () => {
        document.getElementById("float-options").classList.toggle("show");
    });
    
    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            if (href === "#") return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
    
    // Formulaire contact
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", () => {
            showToast("📨 Message envoyé !");
        });
    }
    
    // Fermer les modals en cliquant à l'extérieur
    document.addEventListener("click", (e) => {
        // Custom modal
        const customModal = document.getElementById("custom-modal");
        if (customModal && e.target === customModal) {
            customModal.classList.remove("open");
        }
        
        // Order modal
        const orderModal = document.getElementById("order-modal");
        if (orderModal && e.target === orderModal) {
            orderModal.classList.remove("open");
        }
        
        // Lightbox
        const lightbox = document.getElementById("lightbox");
        if (lightbox && e.target === lightbox) {
            lightbox.classList.remove("open");
        }
        
        // Cart panel
        const cartPanel = document.getElementById("cart-panel");
        if (cartPanel && e.target === cartPanel) {
            cartPanel.classList.remove("open");
        }
        
        // Menu flottant
        const floatOptions = document.getElementById("float-options");
        if (floatOptions && floatOptions.classList.contains("show") && 
            !e.target.closest(".float-container")) {
            floatOptions.classList.remove("show");
        }
    });
}

// ==================== INITIALISATION ====================
function init() {
    // Année dans le footer
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Initialiser les composants
    renderProducts();
    renderGallery();
    initCustomizer();
    setupOrderForm();
    updateCartUI();
    setupEventListeners();
    
    console.log("✅ Boo-gie! initialisé avec succès");
}

// ==================== FONCTIONS GLOBALES ====================
// Pour les boutons HTML onclick
window.addToCart = addToCart;
window.openLightbox = openLightbox;
window.openLightboxBySrc = openLightboxBySrc;
window.toggleFloatMenu = function() {
    const menu = document.getElementById("float-options");
    if (menu) {
        menu.classList.toggle("show");
    }
};

// ==================== DÉMARRAGE ====================
document.addEventListener("DOMContentLoaded", init);
