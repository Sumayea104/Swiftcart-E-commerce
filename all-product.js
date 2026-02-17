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

/**
 * Cart Sync for Trending Products
 */
function syncCart() {
    localStorage.setItem('swiftCart', JSON.stringify(cart));
    updateBadge(); // Updates the Navbar number
    if (typeof renderCartUI === 'function') renderCartUI(); // Updates Sidebar
}


let allProducts = [];
let cart = JSON.parse(localStorage.getItem('swiftCart')) || [];

/**
 * Core Application Logic
 */
async function initApp() {
    toggleSpinner(true);
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        allProducts = await response.json();
        renderProducts(allProducts);
        updateBadge();
        renderCartUI();
    } catch (error) {
        console.error("Initialization Error:", error);
    } finally {
        toggleSpinner(false);
    }
}

function renderProducts(items) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    grid.style.opacity = "1";
    grid.innerHTML = items.map(p => `
        <div class="bg-white flex flex-col p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div class="aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-6 mb-4 overflow-hidden">
                <img src="${p.image}" class="max-h-full object-contain transition-transform duration-500 group-hover:scale-110">
            </div>
            <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-1 rounded">${p.category}</span>
                <span class="text-xs font-bold text-gray-700">★ ${p.rating.rate}</span>
            </div>
            <h3 class="text-sm font-bold text-gray-900 line-clamp-2 h-10 mb-2">${p.title}</h3>
            <p class="text-lg font-black text-gray-900 mb-4">$${p.price.toFixed(2)}</p>
            <div class="flex gap-2 mt-auto">
                <button onclick="openProductModal(${p.id})" class="flex-1 py-2 text-xs font-bold border border-gray-200 rounded-lg hover:bg-gray-50 transition">Details</button>
                <button onclick="addToCart(${p.id}, '${p.title.replace(/'/g, "\\'")}', ${p.price}, '${p.image}')" class="flex-1 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Add</button>
            </div>
        </div>
    `).join('');
}

/**
 * Filter & Search
 */
async function filterProducts(category, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.className = "filter-btn px-6 py-2 rounded-full text-sm font-medium bg-white text-gray-500 border border-gray-100 transition-all");
    btn.className = "filter-btn px-6 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white shadow-md transition-all";
    
    toggleSpinner(true);
    const url = category === 'all' ? 'https://fakestoreapi.com/products' : `https://fakestoreapi.com/products/category/${category}`;
    const res = await fetch(url);
    const data = await res.json();
    renderProducts(data);
    toggleSpinner(false);
}

function searchProducts() {
    const term = document.getElementById('productSearch').value.toLowerCase();
    if (!term) {
        renderProducts(allProducts); // Jodi search empty thake
        return;
    }
    const filtered = allProducts.filter(p => p.title.toLowerCase().includes(term));
    renderProducts(filtered);
}

/**
 * Modal & Cart System
 */
async function openProductModal(id) {
    toggleSpinner(true);
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const p = await res.json();
    document.getElementById('modalContent').innerHTML = `
        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-gray-50 p-6 rounded-2xl flex items-center justify-center"><img src="${p.image}" class="max-h-64 object-contain"></div>
            <div>
                <h2 class="text-2xl font-bold mb-4">${p.title}</h2>
                <p class="text-gray-500 text-sm mb-6">${p.description}</p>
                <p class="text-2xl font-black mb-6">$${p.price}</p>
                <button onclick="addToCart(${p.id},'${p.title.replace(/'/g,"\\'")}',${p.price},'${p.image}')" class="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">Add to Cart</button>
            </div>
        </div>`;
    document.getElementById('productModal').classList.remove('hidden');
    toggleSpinner(false);
}

function closeModal() { document.getElementById('productModal').classList.add('hidden'); }

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    const isOpen = !sidebar.classList.contains('translate-x-full');
    sidebar.classList.toggle('translate-x-full');
    overlay.classList.toggle('hidden');
    if(!isOpen) renderCartUI();
}

function addToCart(id, title, price, image) {
    const item = cart.find(i => i.id === id);
    item ? item.qty++ : cart.push({ id, title, price, image, qty: 1 });
    syncAndReload();
}

function removeItem(id) {
    cart = cart.filter(i => i.id !== id);
    syncAndReload();
}

function adjustQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty += delta;
        if(item.qty <= 0) removeItem(id);
        else syncAndReload();
    }
}

function renderCartUI() {
    const list = document.getElementById('cartItemsList');
    let total = 0;
    list.innerHTML = cart.length === 0 ? '<p class="text-center text-gray-400">Cart is empty</p>' : cart.map(i => {
        total += i.price * i.qty;
        return `<div class="flex gap-4 items-center">
            <img src="${i.image}" class="w-12 h-12 object-contain bg-gray-50 p-1 rounded">
            <div class="flex-1 text-xs">
                <h4 class="font-bold line-clamp-1">${i.title}</h4>
                <div class="flex items-center gap-2 mt-1">
                    <button onclick="adjustQty(${i.id},-1)" class="w-5 h-5 bg-gray-100 rounded">-</button>
                    <span>${i.qty}</span>
                    <button onclick="adjustQty(${i.id},1)" class="w-5 h-5 bg-gray-100 rounded">+</button>
                    <span class="ml-auto font-bold">$${(i.price * i.qty).toFixed(2)}</span>
                </div>
            </div>
            <button onclick="removeItem(${i.id})" class="text-red-500 font-bold">&times;</button>
        </div>`;
    }).join('');
    document.getElementById('cartTotalPrice').innerText = `$${total.toFixed(2)}`;
}

function syncAndReload() {
    localStorage.setItem('swiftCart', JSON.stringify(cart));    
    updateBadge();
    renderCartUI();

    // Animation feedback
    const badge = document.getElementById('cartCount');
    if (badge) {
        badge.classList.add('scale-125');
        setTimeout(() => badge.classList.remove('scale-125'), 200);
    }
}

function updateBadge() {
    const badge = document.getElementById('cartCount');
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

    if (badge) {
        if (totalItems > 0) {
            badge.innerText = totalItems;
            badge.style.display = "flex"; // Show only if items exist
        } else {
            badge.style.display = "none"; // Hide bubble if cart is empty
        }
    }
}

function toggleSpinner(show) {
    document.getElementById('spinner').style.display = show ? 'flex' : 'none';
}

initApp();