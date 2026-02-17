// 1. Global State
let cart = JSON.parse(localStorage.getItem('swiftCart')) || [];

// 2. Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    loadTrendingProducts();
    
    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// 3. Load Trending Products (Professional Grid)
async function loadTrendingProducts() {
    const container = document.getElementById("trending-container");
    if (!container) return;

    try {
        const response = await fetch("https://fakestoreapi.com/products?limit=3");
        const products = await response.json();
        container.innerHTML = "";

        products.forEach((product) => {
            const safeTitle = product.title.replace(/'/g, "\\'");
            
            container.innerHTML += `
                <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all flex flex-col h-full group">
                    <div class="bg-gray-50 rounded-xl h-64 flex items-center justify-center p-6 mb-4 overflow-hidden">
                        <img src="${product.image}" alt="${product.title}" 
                             class="object-contain max-h-full w-full group-hover:scale-105 transition duration-500">
                    </div>
                    <div class="flex-grow">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase">${product.category}</span>
                            <span class="text-xs text-gray-500 font-bold">★ ${product.rating.rate}</span>
                        </div>
                        <h3 class="font-bold text-gray-900 text-base line-clamp-2 mb-2 h-12">${product.title}</h3>
                        <p class="text-xl font-black text-gray-900 mb-4">$${product.price.toFixed(2)}</p>
                    </div>
                    <div class="flex gap-2">
                        <button onclick="openProductModal(${product.id})" 
                                class="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold hover:bg-gray-50 transition active:scale-95">
                            Details
                        </button>
                        
                        <button onclick="addToCart(${product.id}, '${safeTitle}', ${product.price}, '${product.image}')" 
                                class="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition active:scale-95">
                            Add
                        </button>
                    </div>
                </div>`;
        });
    } catch (e) {
        console.error("Error loading trending products:", e);
    }
}
// 4. Cart Logic
function addToCart(id, title, price, image) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, title, price, image, qty: 1 });
    }
    syncCart();
}

function syncCart() {
    localStorage.setItem('swiftCart', JSON.stringify(cart));
    updateBadge();
    
    // UI Feedback for Badge
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.classList.add('scale-110');
        setTimeout(() => badge.classList.remove('scale-110'), 200);
    }
}

function updateBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    
    if (totalQty > 0) {
        badge.innerText = totalQty;
        badge.classList.remove('hidden');
        badge.style.display = 'flex';
    } else {
        badge.classList.add('hidden');
    }
}

// 5. Modal Logic
async function openProductModal(id) {
    const modal = document.getElementById('productModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalPrice = document.getElementById('modalPrice');
    const modalDescription = document.getElementById('modalDescription');
    const modalRating = document.getElementById('modalRating');

    // Show loading state or just show the modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const product = await response.json();

        // Populate Modal Fields
        modalImage.src = product.image;
        modalTitle.innerText = product.title;
        modalCategory.innerText = product.category;
        modalPrice.innerText = `$${product.price.toFixed(2)}`;
        modalDescription.innerText = product.description;

        // Populate Rating Stars
        modalRating.innerHTML = `
            <span class="text-yellow-400 flex items-center">
                ${'★'.repeat(Math.round(product.rating.rate))}
                <span class="text-gray-400 text-xs ml-2">(${product.rating.count} reviews)</span>
            </span>
        `;

        // Connect the "Add to Cart" button inside the modal too
        const modalAddBtn = modal.querySelector('button.bg-indigo-600');
        const safeTitle = product.title.replace(/'/g, "\\'");
        modalAddBtn.onclick = () => addToCart(product.id, safeTitle, product.price, product.image);

    } catch (error) {
        console.error("Error fetching product details:", error);
    }
}


// 1. Close Modal Function (Global)
function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

// 2. Open Product Modal (Global)
async function openProductModal(id) {
    const modal = document.getElementById('productModal');
    
    // Show modal immediately with a flex layout
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const product = await response.json();

        // Map Data to HTML IDs
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalTitle').innerText = product.title;
        document.getElementById('modalCategory').innerText = product.category;
        document.getElementById('modalDescription').innerText = product.description;
        document.getElementById('modalPrice').innerText = `$${product.price.toFixed(2)}`;

        // Render Stars
        const stars = Math.round(product.rating.rate);
        document.getElementById('modalRating').innerHTML = `
            <span class="text-yellow-400 text-lg">${'★'.repeat(stars)}${'☆'.repeat(5 - stars)}</span>
            <span class="text-gray-400 text-xs font-bold ml-2">(${product.rating.count} Reviews)</span>
        `;

        // Update the "Add to Cart" button inside the modal
        const modalAddBtn = document.getElementById('modalAddToCart');
        const safeTitle = product.title.replace(/'/g, "\\'");
        
        modalAddBtn.onclick = () => {
            addToCart(product.id, safeTitle, product.price, product.image);
            closeModal(); // Optional: close modal after adding
        };

    } catch (error) {
        console.error("Error loading product:", error);
    }
}

// 3. Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productModal');

    // Close modal if clicking on the dark background
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
});