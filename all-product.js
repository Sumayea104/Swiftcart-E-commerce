const productsGrid = document.getElementById('productsGrid');
const categoryButtons = document.getElementById('categoryButtons');
const cartCount = document.getElementById('cartCount');

const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const modalPrice = document.getElementById('modalPrice');
const modalRating = document.getElementById('modalRating');
const modalDescription = document.getElementById('modalDescription');

let cart = 0;
const fixedCategories = ["All", "electronics", "jewelery", "men's clothing", "women's clothing"];

// Load Categories
function loadCategories() {
  categoryButtons.innerHTML = "";
  fixedCategories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = "px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full capitalize transition";
    btn.addEventListener('click', () => loadProducts(cat));
    categoryButtons.appendChild(btn);
  });
}

// Load Products
async function loadProducts(category = "") {
  productsGrid.innerHTML = `<p class="text-gray-500 col-span-full text-center py-10">Loading products...</p>`;
  try {
    let url = 'https://fakestoreapi.com/products';
    if (category && category !== "All") url = `https://fakestoreapi.com/products/category/${category}`;
    const res = await fetch(url);
    const products = await res.json();

    productsGrid.innerHTML = "";
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = "bg-white rounded-lg shadow flex flex-col cursor-pointer hover:shadow-lg transition";

      card.innerHTML = `
        <div class="h-48 w-full overflow-hidden rounded-t-lg">
          <img src="${product.image}" alt="${product.title}" class="h-full w-full object-cover">
        </div>
        <div class="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 truncate">${product.title}</h3>
            <p class="mt-1 text-gray-500 text-sm capitalize">${product.category}</p>
            <p class="mt-2 text-indigo-600 font-bold">$${product.price}</p>
            <div class="mt-2 flex items-center space-x-1">
              ${getStars(product.rating.rate)}
              <span class="ml-2 text-gray-500 text-sm">(${product.rating.rate.toFixed(1)})</span>
            </div>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition add-cart">
              Add to Cart
            </button>
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-3 rounded-lg transition details-btn">
              Details
            </button>
          </div>
        </div>
      `;

      // Add to cart
      card.querySelector('.add-cart').addEventListener('click', e => {
        e.stopPropagation();
        cart++;
        cartCount.textContent = cart;
      });

      // Open modal
      card.querySelector('.details-btn').addEventListener('click', e => {
        e.stopPropagation();
        openModal(product);
      });

      productsGrid.appendChild(card);
    });
  } catch (err) {
    productsGrid.innerHTML = `<p class="text-red-500 col-span-full text-center py-10">Failed to load products.</p>`;
    console.error(err);
  }
}

// Modal
function openModal(product) {
  modalImage.src = product.image;
  modalTitle.textContent = product.title;
  modalCategory.textContent = product.category;
  modalPrice.textContent = `$${product.price}`;
  modalRating.innerHTML = getStars(product.rating.rate) + `<span class="ml-2 text-gray-500 text-sm">(${product.rating.rate.toFixed(1)})</span>`;
  modalDescription.textContent = product.description;
  productModal.classList.remove('hidden');
  productModal.classList.add('flex');
}

modalClose.addEventListener('click', () => {
  productModal.classList.add('hidden');
  productModal.classList.remove('flex');
});

productModal.addEventListener('click', e => {
  if (e.target === productModal) {
    productModal.classList.add('hidden');
    productModal.classList.remove('flex');
  }
});

function getStars(rate) {
  const fullStars = Math.floor(rate);
  const halfStar = rate % 1 >= 0.5 ? 1 : 0;
  let html = '';
  for (let i = 0; i < fullStars; i++) html += '<span class="text-yellow-400">★</span>';
  if (halfStar) html += '<span class="text-yellow-400">★</span>';
  for (let i = fullStars + halfStar; i < 5; i++) html += '<span class="text-gray-300">★</span>';
  return html;
}

// Initialize
loadCategories();
loadProducts();