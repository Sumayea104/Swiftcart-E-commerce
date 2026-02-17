
  const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    // Toggle hidden class to show/hide menu
    mobileMenu.classList.toggle('hidden');
});

async function loadTrendingProducts() {
  const container = document.getElementById("trending-container");
    try {
      const response = await fetch("https://fakestoreapi.com/products?limit=3",);
      const products = await response.json();
      container.innerHTML = "";
      products.forEach((product) => {
              container.innerHTML += `
          <div class="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
            <div class="bg-gray-50 rounded-lg h-64 flex items-center justify-center p-6 mb-4 overflow-hidden">
              <img src="${product.image}" alt="${product.title}" class="object-contain max-h-full w-full hover:scale-110 transition duration-300">
            </div>

            <div class="flex-grow">
              <div class="flex justify-between items-center mb-2">
                <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase">${product.category}</span>
                <span class="text-sm text-gray-500">⭐ ${product.rating.rate}</span>
              </div>
              <h3 class="font-bold text-gray-900 line-clamp-2 mb-2 h-12">${product.title}</h3>
              <p class="text-xl font-black text-gray-900 mb-4">$${product.price}</p>
            </div>

            <div class="flex gap-2">
              <a href="product-details.html?id=${product.id}" class="flex-1 text-center border border-gray-200 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">Details</a>
              <button class="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition">Add</button>
            </div>
          </div>
        `;
            });
          } catch (error) {
            container.innerHTML =
              '<p class="col-span-full text-red-500 text-center">Failed to load images. Please check your internet.</p>';
          }
        }

        loadTrendingProducts();

        
      
