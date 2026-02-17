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

// 1. Global State
let allProducts = []; 
let cart = JSON.parse(localStorage.getItem('swiftCart')) || [];

// 2. Initialize 
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

// 3. Load Products 
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

// 5. Drawer & UI Logic
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
        list.innerHTML = `<p class="text-center py-10 text-gray-400">Cart is empty</p>`;
        if (totalEl) totalEl.innerText = "$0.00";
        return;
    }

    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="flex items-center gap-3 mb-3 border-b pb-2">
                <img src="${item.image}" class="h-10 w-10 object-contain">
                <div class="flex-grow">
                    <h4 class="text-[10px] font-bold truncate w-32">${item.title}</h4>
                    <p class="text-indigo-600 text-xs">$${item.price} x ${item.qty}</p>
                </div>
                <button onclick="removeFromCart(${index})" class="text-red-500 font-bold text-xl">&times;</button>
            </div>`;
    }).join('');
    if (totalEl) totalEl.innerText = `$${total.toFixed(2)}`;
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

// 6. Modal Logic
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