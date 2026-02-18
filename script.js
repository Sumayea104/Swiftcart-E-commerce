document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Toggle Mobile Menu
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Ensure the cart badge updates immediately on page load
    updateBadge();
});

//  Global State
let allProducts = []; 
let cart = JSON.parse(localStorage.getItem('swiftCart')) || [];

//  Initialize 
    document.addEventListener('DOMContentLoaded', () => {
    updateBadge();
    loadTrendingProducts();
    renderCartUI(); 
    
    // Modal Close Listeners
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    }
});

//  Load Products 
async function loadTrendingProducts() {
    const container = document.getElementById("trending-container");
    if (!container) return;

    try {
        const response = await fetch("https://fakestoreapi.com/products?limit=3");
        const products = await response.json();
        allProducts = products; 

        container.innerHTML = products.map(product => `
            <div class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg flex flex-col h-full group">
                <div class="bg-gray-50 rounded-xl h-64 flex items-center justify-center p-6 mb-4 overflow-hidden">
                    <img src="${product.image}" class="object-contain max-h-full w-full group-hover:scale-105 transition duration-500">
                </div>
                <div class="flex-grow">
                    <h3 class="font-bold text-gray-900 text-base line-clamp-2 mb-2 h-12">${product.title}</h3>
                    <p class="text-xl font-black text-gray-900 mb-4">$${product.price.toFixed(2)}</p>
                </div>
                <div class="flex gap-2">
                    <button onclick="openProductModal(${product.id})" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold">Details</button>
                    <button onclick="addToCart(${product.id})" class="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700">Add</button>
                </div>
            </div>`).join('');
    } catch (e) { console.error("Error:", e); }
}

//  Load Categories dynamically
async function loadCategories() {
    const container = document.getElementById('category-filters');
    if (!container) return;
    const res = await fetch('https://fakestoreapi.com/products/categories');
    const categories = await res.json();
    
    container.innerHTML = ['all', ...categories].map(cat => `
        <button onclick="filterByCategory('${cat}', this)" 
            class="filter-btn px-4 py-2 rounded-full border border-gray-200 text-xs font-bold hover:bg-indigo-50 capitalize transition-all">
            ${cat}
        </button>`).join('');
    if (container.firstElementChild) container.firstElementChild.classList.add('bg-indigo-600', 'text-white');
}

//  Filter Logic
async function filterByCategory(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-indigo-600', 'text-white'));
    btn.classList.add('bg-indigo-600', 'text-white');
    const filtered = category === 'all' ? allProducts : allProducts.filter(p => p.category === category);
    renderProducts(filtered);
}

// Updated to fetch data and call render
async function loadTrendingProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        allProducts = await response.json();
        renderProducts(allProducts);
    } catch (e) { console.error(e); }
}


function renderProducts(products) {
    const container = document.getElementById("trending-container");
    
    
    const limitedList = products.slice(0, 3);
    
    container.innerHTML = limitedList.map(product => {
        return `
            <div class="bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-50 group">
                <div class="bg-gray-50 rounded-2xl h-72 flex items-center justify-center p-8 mb-6 relative overflow-hidden">
                    <img src="${product.image}" class="object-contain max-h-full w-full group-hover:scale-110 transition duration-500">
                </div>
                
                <div class="flex-grow px-2">
                    <p class="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-2">${product.category}</p>
                    <h3 class="font-bold text-gray-800 text-lg line-clamp-1 mb-2">${product.title}</h3>
                    <div class="flex items-center justify-between mb-6">
                        <p class="text-2xl font-black text-gray-900">$${product.price.toFixed(2)}</p>
                        <span class="text-yellow-400 text-sm font-bold">★ ${product.rating.rate}</span>
                    </div>
                </div>

                <div class="flex gap-3">
                    <button onclick="openProductModal(${product.id})" class="filter-btn flex-1 py-3 rounded-2xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition">View Details</button>
                    <button onclick="addToCart(${product.id})" class="filter-btn flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition">Add</button>
                </div>
            </div>`;
    }).join('');
}


function filterByCategory(category, btn) {
    
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-indigo-600', 'text-white', 'shadow-md');
        b.classList.add('bg-white', 'text-gray-600');
    });

    
    btn.classList.add('bg-indigo-600', 'text-white', 'shadow-md');
    btn.classList.remove('bg-white', 'text-gray-600');

    
    const filtered = category === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.category === category);
    
    renderProducts(filtered);
}
function addToCart(id) {
    const product = allProducts.find(p => p.id === Number(id));
    if (!product) return;

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveAndRender();
    
}

//  Drawer & UI Logic
function toggleCart(show) {
    const sidebar = document.getElementById('cartSidebar');
    if (!sidebar) return;
    
    if (show) {
        sidebar.classList.remove('hidden');
        renderCartUI(); 
    } else {
        sidebar.classList.add('hidden'); 
    }
}

function renderCartUI() {
    const list = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotal');
    if (!list) return;

    if (cart.length === 0) {
        list.innerHTML = `<div class="text-center py-10 text-gray-400 text-sm">Your cart is empty</div>`;
        if (totalEl) totalEl.innerText = "$0.00";
        return;
    }

    let total = 0;
    list.innerHTML = cart.map((item) => {
        total += item.price * item.qty;
        return `
            <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <img src="${item.image}" class="h-14 w-14 object-contain bg-white p-2 rounded-xl shadow-sm">
                
                <div class="flex-grow min-w-0">
                    <h4 class="text-xs font-bold text-gray-800 truncate">${item.title}</h4>
                    <p class="text-indigo-600 font-black text-sm mt-1">$${(item.price * item.qty).toFixed(2)}</p>
                    
                    <div class="flex items-center gap-3 mt-2">
                        <div class="flex items-center border border-gray-200 rounded-lg bg-white">
                            <button onclick="updateQuantity(${item.id}, -1)" class="px-2 py-1 hover:bg-gray-100 text-gray-500 transition">-</button>
                            <span class="px-2 text-xs font-bold text-gray-700">${item.qty}</span>
                            <button onclick="updateQuantity(${item.id}, 1)" class="px-2 py-1 hover:bg-gray-100 text-gray-500 transition">+</button>
                        </div>
                        <button onclick="removeItem(${item.id})" class="text-[10px] text-red-400 font-bold uppercase tracking-wider hover:text-red-600">Remove</button>
                    </div>
                </div>
            </div>`;
    }).join('');
    
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
}

// Function to increase or decrease quantity
function updateQuantity(id, change) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.qty += change;

    // If quantity becomes 0, remove the item
    if (item.qty <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveAndRender();
}

// Cleaner remove function using ID
function removeItem(id) {
    cart = cart.filter(p => p.id !== id);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('swiftCart', JSON.stringify(cart));
    updateBadge();
    renderCartUI();
}

function updateBadge() {
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    const totalQty = cart.reduce((acc, item) => acc + item.qty, 0);
    badge.innerText = totalQty;
    totalQty > 0 ? badge.classList.remove('hidden') : badge.classList.add('hidden');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRender();
}

//  Modal Logic
async function openProductModal(id) {
    const modal = document.getElementById('productModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const product = await response.json();
        document.getElementById('modalImage').src = product.image;
        document.getElementById('modalTitle').innerText = product.title;
        document.getElementById('modalPrice').innerText = `$${product.price.toFixed(2)}`;
        document.getElementById('modalDescription').innerText = product.description;
        document.getElementById('modalCategory').innerText = product.category;
        const starHTML = '★'.repeat(Math.round(product.rating.rate)) + '☆'.repeat(5 - Math.round(product.rating.rate));
        document.getElementById('modalRating').innerHTML = `<span class="text-yellow-400">${starHTML}</span> (${product.rating.rate})`;
        const modalAddBtn = document.getElementById('modalAddToCart');
        if (modalAddBtn) {
            modalAddBtn.onclick = () => {
                if(!allProducts.find(p => p.id === product.id)) allProducts.push(product);
                addToCart(product.id);
                closeModal();
            };
        }
    } catch (e) { console.error(e); }
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) { modal.classList.add('hidden'); modal.classList.remove('flex'); }
}