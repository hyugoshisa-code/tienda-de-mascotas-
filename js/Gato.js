const products = [
    {
        id: "gato-01",
        name: "Mimaskot Gato Cachorro",
        price: 49,
        sold: 92,
        stage: "gatito",
        marca: "mimaskot",
        categoria: "comida",
        razas: ["siames", "british", "persa"],
        image: "../assets/img/prductos de gato/mimaskot gato cachorro.webp"
    },
    {
        id: "gato-02",
        name: "Ricocat Cachorros",
        price: 45,
        sold: 86,
        stage: "gatito",
        marca: "ricocat",
        categoria: "comida",
        razas: ["maine", "persa", "fellino"],
        image: "../assets/img/prductos de gato/ricocat cachorros.webp"
    },
    {
        id: "gato-03",
        name: "Supercat Gatitos",
        price: 35,
        sold: 80,
        stage: "gatito",
        marca: "supercat",
        categoria: "comida",
        razas: ["siames", "esfinge"],
        image: "../assets/img/prductos de gato/supercat  gatitos.webp"
    },
    {
        id: "gato-04",
        name: "Pate Ricocat Gatitos",
        price: 5.9,
        sold: 78,
        stage: "gatito",
        marca: "ricocat",
        categoria: "comida",
        razas: ["british", "persa"],
        image: "../assets/img/prductos de gato/pate ricocat gatitos.webp"
    },
    {
        id: "gato-05",
        name: "Pitucats Gatitos",
        price: 12.9,
        sold: 73,
        stage: "gatito",
        marca: "pitucats",
        categoria: "comida",
        razas: ["maine", "fellino"],
        image: "../assets/img/prductos de gato/pitucats gatitos.jpg"
    },
    {
        id: "gato-06",
        name: "Pate Gatitos Supercat",
        price: 8.9,
        sold: 65,
        stage: "gatito",
        marca: "supercat",
        categoria: "comida",
        razas: ["siames", "british"],
        image: "../assets/img/prductos de gato/pate gatitos supercat.webp"
    },
    {
        id: "gato-07",
        name: "Ricocat Sachet Gatito",
        price: 4.9,
        sold: 60,
        stage: "gatito",
        marca: "ricocat",
        categoria: "comida",
        razas: ["persa", "esfinge"],
        image: "../assets/img/prductos de gato/ricocatsachet.webp"
    },
    {
        id: "gato-08",
        name: "Supercat Atún Adultos",
        price: 7.9,
        sold: 58,
        stage: "gatito",
        marca: "supercat",
        categoria: "comida",
        razas: ["siames", "maine"],
        image: "../assets/img/prductos de gato/lata adultos atun supercat.webp"
    },
    {
        id: "gato-09",
        name: "Ricocat Sachet Pack",
        price: 15.5,
        sold: 56,
        stage: "gatito",
        marca: "ricocat",
        categoria: "salud",
        razas: ["british", "fellino"],
        image: "../assets/img/prductos de gato/ricocatsachet2.webp"
    },
    {
        id: "gato-10",
        name: "Mimascok Gato Adulto",
        price: 55,
        sold: 53,
        stage: "gatito",
        marca: "mimaskot",
        categoria: "comida",
        razas: ["persa", "maine"],
        image: "../assets/img/prductos de gato/mimascok gato adulto.webp"
    },
    {
        id: "gato-11",
        name: "Ricocat Adulto",
        price: 89,
        sold: 72,
        stage: "adulto",
        marca: "ricocat",
        categoria: "comida",
        razas: ["siames", "persa"],
        image: "../assets/img/prductos de gato/ricocat adulto.webp"
    },
    {
        id: "gato-12",
        name: "Supercat Adultos",
        price: 28,
        sold: 69,
        stage: "adulto",
        marca: "supercat",
        categoria: "comida",
        razas: ["british", "maine"],
        image: "../assets/img/prductos de gato/supercat adultos.webp"
    },
    {
        id: "gato-13",
        name: "Pate Ricocat Adulto",
        price: 6.9,
        sold: 61,
        stage: "adulto",
        marca: "ricocat",
        categoria: "salud",
        razas: ["esfinge", "fellino"],
        image: "../assets/img/prductos de gato/pate  adulto ricocat.webp"
    },
    {
        id: "gato-14",
        name: "Sachet Ricocat Adulto",
        price: 4.9,
        sold: 54,
        stage: "senior",
        marca: "ricocat",
        categoria: "comida",
        razas: ["siames", "maine"],
        image: "../assets/img/prductos de gato/sachet ricocat adulto.webp"
    }
];

const state = {
    query: "",
    stage: "gatito",
    sort: "vendidos",
    page: 1,
    perPage: 10
};

const cartKey = "docpetCart";
const favoriteKey = "docpetFavorites";

const productsGrid = document.getElementById("productsGrid");
const pagination = document.getElementById("pagination");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");

function getStorage(key, fallback) {
    const saved = localStorage.getItem(key);

    if (!saved) {
        return fallback;
    }

    try {
        return JSON.parse(saved);
    } catch {
        return fallback;
    }
}

function saveStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function normalize(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function getCheckedValues(filterName) {
    return [...document.querySelectorAll(`[data-filter="${filterName}"]:checked`)].map(input => input.value);
}

function productMatches(product) {
    const selectedRazas = getCheckedValues("raza");
    const selectedCategories = getCheckedValues("categoria");
    const selectedBrands = getCheckedValues("marca");
    const minPrice = Number(document.getElementById("minPrice").value) || 0;
    const maxPrice = Number(document.getElementById("maxPrice").value) || Infinity;
    const searchText = normalize(`${product.name} ${product.marca} ${product.categoria}`);

    const matchesStage = product.stage === state.stage;
    const matchesSearch = searchText.includes(normalize(state.query));
    const matchesRaza = selectedRazas.length === 0 || selectedRazas.some(raza => product.razas.includes(raza));
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categoria);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.marca);
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

    return matchesStage && matchesSearch && matchesRaza && matchesCategory && matchesBrand && matchesPrice;
}

function sortProducts(list) {
    const sorted = [...list];

    if (state.sort === "menor-precio") {
        sorted.sort((a, b) => a.price - b.price);
    }

    if (state.sort === "mayor-precio") {
        sorted.sort((a, b) => b.price - a.price);
    }

    if (state.sort === "az") {
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (state.sort === "vendidos") {
        sorted.sort((a, b) => b.sold - a.sold);
    }

    return sorted;
}

function formatPrice(price) {
    return `S/ ${price.toFixed(2)}`;
}

function getFavorites() {
    return getStorage(favoriteKey, []);
}

function renderProducts() {
    const favorites = getFavorites();
    const filteredProducts = sortProducts(products.filter(productMatches));
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / state.perPage));

    if (state.page > totalPages) {
        state.page = totalPages;
    }

    const start = (state.page - 1) * state.perPage;
    const visibleProducts = filteredProducts.slice(start, start + state.perPage);

    resultCount.textContent = `${filteredProducts.length} producto(s) encontrados`;
    emptyState.hidden = filteredProducts.length > 0;

    productsGrid.innerHTML = visibleProducts.map(product => {
        const isFavorite = favorites.includes(product.id);

        return `
            <article class="productCard">
                <button class="favoriteButton ${isFavorite ? "active" : ""}" type="button" data-action="favorite" data-id="${product.id}">
                    <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
                </button>

                <div class="productImage">
                    <img src="${product.image}" alt="${product.name}">
                </div>

                <h3>${product.name}</h3>
                <p class="productPrice">${formatPrice(product.price)}</p>

                <button class="addCartButton" type="button" data-action="cart" data-id="${product.id}">
                    <i class="fa-solid fa-cart-plus"></i>
                    Agregar al Carrito
                </button>
            </article>
        `;
    }).join("");

    renderPagination(totalPages);
}

function renderPagination(totalPages) {
    let buttons = `
        <button type="button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""}>
            <i class="fa-solid fa-chevron-left"></i>
        </button>
    `;

    for (let page = 1; page <= totalPages; page++) {
        buttons += `<button type="button" class="${page === state.page ? "active" : ""}" data-page="${page}">${page}</button>`;
    }

    buttons += `
        <button type="button" data-page="${state.page + 1}" ${state.page === totalPages ? "disabled" : ""}>
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    `;

    pagination.innerHTML = buttons;
}

function updateCartCount() {
    const cart = getStorage(cartKey, []);
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
}

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const cart = getStorage(cartKey, []);
    const itemInCart = cart.find(item => item.id === productId);

    if (!product) {
        return;
    }

    if (itemInCart) {
        itemInCart.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveStorage(cartKey, cart);
    updateCartCount();
    showToast(`${product.name} agregado al carrito`);
}

function toggleFavorite(productId) {
    const favorites = getFavorites();
    const exists = favorites.includes(productId);
    const updatedFavorites = exists ? favorites.filter(id => id !== productId) : [...favorites, productId];

    saveStorage(favoriteKey, updatedFavorites);
    renderProducts();
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    state.query = document.getElementById("buscador").value;
    state.page = 1;
    renderProducts();
});

document.getElementById("buscador").addEventListener("input", event => {
    state.query = event.target.value;
    state.page = 1;
    renderProducts();
});

document.getElementById("sortProducts").addEventListener("change", event => {
    state.sort = event.target.value;
    state.page = 1;
    renderProducts();
});

document.getElementById("priceButton").addEventListener("click", () => {
    state.page = 1;
    renderProducts();
});

document.querySelectorAll("[data-filter]").forEach(input => {
    input.addEventListener("change", () => {
        state.page = 1;
        renderProducts();
    });
});

document.querySelectorAll(".stageOption").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".stageOption").forEach(option => option.classList.remove("active"));
        button.classList.add("active");

        state.stage = button.dataset.stage;
        state.page = 1;
        document.getElementById("stageName").textContent = button.textContent;
        renderProducts();
    });
});

document.getElementById("clearFilters").addEventListener("click", () => {
    document.querySelectorAll("[data-filter]").forEach(input => {
        input.checked = false;
    });

    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("buscador").value = "";

    state.query = "";
    state.page = 1;
    renderProducts();
});

productsGrid.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    if (button.dataset.action === "cart") {
        addToCart(button.dataset.id);
    }

    if (button.dataset.action === "favorite") {
        toggleFavorite(button.dataset.id);
    }
});

pagination.addEventListener("click", event => {
    const button = event.target.closest("button[data-page]");

    if (!button || button.disabled) {
        return;
    }

    state.page = Number(button.dataset.page);
    renderProducts();
});

updateCartCount();
renderProducts();