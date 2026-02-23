/* ─────────────────────────────────────────────────────────────
   ORBITA: Script Compartido para Todas las Páginas
   ───────────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", function () {
    initNavbar();
    initBreadcrumbs();
    initAccordion();
    initSmoothScroll();
    initBackToTop();
});

/* ─────────────────────────────────────────────────────────────
   NAVBAR: DETECCIÓN DE SCROLL Y ESTADO ACTIVO
   ───────────────────────────────────────────────────────────── */
function initNavbar() {
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".nav-menu a");
    
    // Estado de scroll
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            navbar?.classList.add("scrolled");
        } else {
            navbar?.classList.remove("scrolled");
        }
    });
    
    // Detectar página actual y marcar como activa
    const currentPath = window.location.pathname;
    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath || href === "/" && currentPath.endsWith("index.html")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

/* ─────────────────────────────────────────────────────────────
   BREADCRUMBS: GENERACIÓN AUTOMÁTICA
   ───────────────────────────────────────────────────────────── */
function initBreadcrumbs() {
    const breadcrumb = document.querySelector(".breadcrumb");
    if (!breadcrumb) return;
    
    const path = window.location.pathname;
    const pages = {
        "/": "Inicio",
        "/index.html": "Inicio",
        "/misiones.html": "Misiones",
        "/mision-detalle.html": "Detalle de Misión",
        "/tecnologia.html": "Tecnología",
        "/astronomia.html": "Astronomía",
        "/timeline.html": "Línea de Tiempo",
        "/blog.html": "Blog",
        "/post.html": "Artículo",
        "/about.html": "Acerca de",
        "/contacto.html": "Contacto",
    };
    
    const title = pages[path] || "Página";
    const links = [
        '<a href="index.html">Inicio</a>',
    ];
    
    if (path !== "/" && path !== "/index.html") {
        links.push(`<span>/</span>`);
        links.push(`<span>${title}</span>`);
    }
    
    breadcrumb.innerHTML = links.join("");
}

/* ─────────────────────────────────────────────────────────────
   ACCORDION / FAQ
   ───────────────────────────────────────────────────────────── */
function initAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
        const button = item.querySelector(".faq-button");
        button?.addEventListener("click", function () {
            item.classList.toggle("open");
            button.setAttribute("aria-expanded", item.classList.contains("open"));
        });
        
        // Teclado: enter/space para abrir
        button?.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                button.click();
            }
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   FILTRADO DE CONTENIDO (BLOG, MISIONES)
   ───────────────────────────────────────────────────────────── */
function filterContent(containerSelector, itemSelector, chipSelector) {
    const chips = document.querySelectorAll(chipSelector);
    const items = document.querySelectorAll(itemSelector);
    const container = document.querySelector(containerSelector);
    
    chips.forEach(chip => {
        chip.addEventListener("click", function () {
            const category = this.getAttribute("data-filter");
            
            // Actualizar chip activo
            chips.forEach(c => c.classList.remove("active"));
            this.classList.add("active");
            
            // Filtrar items
            items.forEach(item => {
                if (category === "all") {
                    item.style.animation = "slideInDown 0.3s ease-out";
                    item.style.display = "grid";
                } else {
                    const itemCategory = item.getAttribute("data-category");
                    if (itemCategory === category) {
                        item.style.animation = "slideInDown 0.3s ease-out";
                        item.style.display = "grid";
                    } else {
                        item.style.display = "none";
                    }
                }
            });
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   BÚSQUEDA / FILTRADO POR TEXTO
   ───────────────────────────────────────────────────────────── */
function initSearch(inputSelector, itemSelector, searchFieldAttribute = "data-search") {
    const searchInput = document.querySelector(inputSelector);
    const items = document.querySelectorAll(itemSelector);
    
    if (!searchInput) return;
    
    let debounceTimer;
    searchInput.addEventListener("input", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = this.value.toLowerCase();
            items.forEach(item => {
                const searchText = item.getAttribute(searchFieldAttribute)?.toLowerCase() || "";
                if (searchText.includes(query)) {
                    item.style.display = "grid";
                    item.style.animation = "slideInDown 0.3s ease-out";
                } else {
                    item.style.display = "none";
                }
            });
        }, 300);
    });
}

/* ─────────────────────────────────────────────────────────────
   FORMULARIOS: VALIDACIÓN
   ───────────────────────────────────────────────────────────── */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initNewsletterForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        const email = input.value.trim();
        
        if (validateEmail(email)) {
            showMessage(form, "success", "¡Te has suscrito! Verifica tu email.");
            input.value = "";
            form.reset();
        } else {
            showMessage(form, "error", "Por favor ingresa un email válido.");
        }
    });
}

function showMessage(form, type, message) {
    let msgEl = form.querySelector(".form-message");
    if (!msgEl) {
        msgEl = document.createElement("p");
        msgEl.className = "form-message";
        form.appendChild(msgEl);
    }
    msgEl.textContent = message;
    msgEl.style.color = type === "success" ? "#34e0b2" : "#ff6b6b";
    msgEl.style.marginTop = "var(--spacing-unit)";
}

/* ─────────────────────────────────────────────────────────────
   SCROLL SUAVE
   ───────────────────────────────────────────────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href !== "#" && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   BOTÓN VOLVER AL INICIO
   ───────────────────────────────────────────────────────────── */
function initBackToTop() {
    const backToTop = document.querySelector(".back-to-top");
    if (!backToTop) return;
    
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* ─────────────────────────────────────────────────────────────
   GENERADOR DE TABLA DE CONTENIDOS (BLOG/ARTICULOS)
   ───────────────────────────────────────────────────────────── */
function generateTableOfContents(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const headings = container.querySelectorAll("h2, h3");
    if (headings.length === 0) return;
    
    const toc = document.createElement("nav");
    toc.className = "toc";
    toc.innerHTML = "<h3>Tabla de Contenidos</h3>";
    
    const ul = document.createElement("ul");
    headings.forEach((heading, idx) => {
        const level = heading.tagName === "H2" ? "h2" : "h3";
        const id = heading.id || `heading-${idx}`;
        heading.id = id;
        
        const li = document.createElement("li");
        li.style.marginLeft = level === "h3" ? "var(--spacing-unit)" : "0";
        li.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        ul.appendChild(li);
    });
    
    toc.appendChild(ul);
    container.insertBefore(toc, container.firstChild);
}

/* ─────────────────────────────────────────────────────────────
   PAGINACIÓN
   ───────────────────────────────────────────────────────────── */
function initPagination(itemsSelector, itemsPerPage = 6) {
    const items = Array.from(document.querySelectorAll(itemsSelector));
    if (items.length === 0) return;
    
    const totalPages = Math.ceil(items.length / itemsPerPage);
    let currentPage = 1;
    
    function showPage(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        
        items.forEach((item, idx) => {
            item.style.display = idx >= start && idx < end ? "grid" : "none";
        });
        
        // Actualizar buttons de paginación
        document.querySelectorAll(".pagination-btn").forEach(btn => {
            btn.classList.toggle("active", parseInt(btn.textContent) === page);
        });
    }
    
    // Crear controles de paginación
    const paginationContainer = document.querySelector(".pagination");
    if (!paginationContainer) return;
    
    paginationContainer.innerHTML = "";
    
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "← Anterior";
    prevBtn.className = "btn btn-secondary btn-small";
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
    paginationContainer.appendChild(prevBtn);
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "pagination-btn btn-small";
        btn.style.padding = "var(--spacing-unit) calc(var(--spacing-unit) * 1.25)";
        btn.style.margin = "0 calc(var(--spacing-unit) * 0.25)";
        btn.addEventListener("click", () => {
            currentPage = i;
            showPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        paginationContainer.appendChild(btn);
    }
    
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "Siguiente →";
    nextBtn.className = "btn btn-secondary btn-small";
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
    paginationContainer.appendChild(nextBtn);
    
    showPage(1);
}

/* ─────────────────────────────────────────────────────────────
   ANIMACIONES CON INTERSECTION OBSERVER
   ───────────────────────────────────────────────────────────── */
function initLazyAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = "slideInDown 0.6s ease-out forwards";
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll(".card, .grid > div").forEach(el => {
        observer.observe(el);
    });
}

document.addEventListener("DOMContentLoaded", initLazyAnimations);

/* ─────────────────────────────────────────────────────────────
   QUIZ / CUESTIONARIO (ASTRONOMÍA)
   ───────────────────────────────────────────────────────────── */
function initQuiz(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;
    
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        let score = 0;
        const questions = form.querySelectorAll("[data-correct]");
        
        questions.forEach(question => {
            const checked = question.querySelector("input:checked");
            if (checked?.value === question.getAttribute("data-correct")) {
                score++;
            }
        });
        
        const percentage = Math.round((score / questions.length) * 100);
        const resultEl = form.querySelector(".quiz-result");
        if (resultEl) {
            resultEl.innerHTML = `
                <p style="font-size: 1.2rem; font-weight: 700;">Resultado: ${score}/${questions.length}</p>
                <p style="color: var(--accent-tertiary);">${percentage}% correcto</p>
            `;
            resultEl.style.display = "block";
        }
    });
}

/* ─────────────────────────────────────────────────────────────
   MODAL
   ───────────────────────────────────────────────────────────── */
function openModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    if (modal) {
        modal.style.display = "flex";
        modal.style.animation = "fadeIn 0.3s ease-out";
    }
}

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    if (modal) {
        modal.style.animation = "fadeOut 0.3s ease-out";
        setTimeout(() => {
            modal.style.display = "none";
        }, 300);
    }
}

// Cerrar modal al hacer click en el fondo
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("modal")) {
        closeModal(`.${e.target.className}`);
    }
});
