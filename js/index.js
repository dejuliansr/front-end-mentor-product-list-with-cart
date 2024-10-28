document.addEventListener('DOMContentLoaded', () => {
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      const dessertsContainer = document.getElementById('desserts-container');
      const cartItemsContainer = document.querySelector('.cart-items');
      const cartCount = document.querySelector('.cart-count');
      const emptyCartImage = document.querySelector('.flex.justify-center');
      const emptyCartText = document.querySelector('.text-gray-600');
      let cartItems = [];

      // Get references to the modal and buttons for confirmation
      const orderConfirmedModal = document.getElementById('orderConfirmedModal');
      const orderDetailsContainer = document.getElementById('orderDetails');
      const orderTotalElement = document.getElementById('orderTotal');
      const startNewOrderButton = document.getElementById('startNewOrderBtn');

      function addToCart(dessert) {
        const existingItem = cartItems.find(item => item.id === dessert.id);
        const dessertImage = document.querySelector(`img[alt="${dessert.name}"]`); // Ambil elemen gambar berdasarkan alt text
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cartItems.push({ ...dessert, quantity: 1 });
          // Tambahkan border ke gambar dessert yang baru ditambahkan ke keranjang
          dessertImage.classList.add('border-solid', 'border-4', 'border-[#c13e1e]');
        }
        updateCart();
      }

      function removeFromCart(dessertId) {
        const itemToRemove = cartItems.find(item => item.id === dessertId); // Temukan item yang akan dihapus
        if (itemToRemove) {
          // Temukan gambar yang sesuai dengan item yang dihapus
          const dessertImage = document.querySelector(`img[alt="${itemToRemove.name}"]`);
          if (dessertImage) {
            // Hapus kelas border dari gambar
            dessertImage.classList.remove('border-solid', 'border-4', 'border-[#c13e1e]');
          }
        }
        cartItems = cartItems.filter(item => item.id !== dessertId);
        updateCart();
      }

      function updateCart() {
        cartItemsContainer.innerHTML = '';

        if (cartItems.length === 0) {
          emptyCartImage.style.display = 'flex';
          emptyCartText.style.display = 'block';
          cartCount.textContent = `0`;
          return;
        } else {
          emptyCartImage.style.display = 'none';
          emptyCartText.style.display = 'none';
        }

        cartItems.forEach(item => {
          const cartItem = document.createElement('div');
          cartItem.classList.add('cart-item', 'flex', 'justify-between', 'items-center', 'my-2');
          cartItem.innerHTML = `
            <div class="flex flex-col">
              <p class="text-Rose/500 font-bold">${item.name}</p>
              <p class="text-[#c13e1e] font-bold">${item.quantity}x 
                <span class="text-Rose/300">@$${item.price}</span>
                <span class="text-Rose/400">$${(item.price * item.quantity).toFixed(2)}</span>
              </p>
            </div>
            <button class="remove-item bg-transparent border-solid border-2 border-Rose/300 px-1 py-1 rounded-full">
              <img src="./assets/images/icon-remove-item.svg" alt="remove">
            </button>
          `;
          cartItem.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
          cartItemsContainer.appendChild(cartItem);
        });

        const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = `${totalItems}`;

        const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const totalPriceElement = document.createElement('div');
        totalPriceElement.classList.add('mt-4', 'text-lg', 'flex', 'justify-between');
        totalPriceElement.innerHTML = `Order Total: <span class="text-Rose/900 font-bold">$${totalPrice.toFixed(2)}</span>`;
        cartItemsContainer.appendChild(totalPriceElement);

        const carbonNeutralMessage = document.createElement('div');
        carbonNeutralMessage.classList.add('mt-4', 'flex', 'text-sm', 'justify-center', 'bg-Rose/50', 'p-2', 'rounded-md');
        carbonNeutralMessage.innerHTML = `
          <img src="./assets/images/icon-carbon-neutral.svg" alt="carbon-neutral">
          <p class="font-semibold">
            This is a <span class="font-bold">carbon-neutral</span> delivery
          </p>
        `;
        cartItemsContainer.appendChild(carbonNeutralMessage);

        const confirmButton = document.createElement('button');
        confirmButton.classList.add('mt-4', 'w-full', 'bg-red-500', 'text-white', 'py-3', 'rounded-full', 'text-lg', 'font-bold');
        confirmButton.textContent = 'Confirm Order';
        confirmButton.addEventListener('click', showOrderConfirmedModal);
        cartItemsContainer.appendChild(confirmButton);
      }

      function showOrderConfirmedModal() {
        orderDetailsContainer.innerHTML = '';
        cartItems.forEach(item => {
          const itemElement = document.createElement('div');
          itemElement.classList.add('flex', 'justify-between', 'my-2', 'items-center');
          itemElement.innerHTML = `
            <div class="flex items-center space-x-2">
              <img src="${item.image.thumbnail}" alt="${item.name}" class="w-10 h-10">
              <div>
                <p class="text-[#c13e1e] font-bold">${item.quantity}x 
                  <span class="text-Rose/300">@$${item.price}</span>
                </p>
              </div>
            </div>
            <p class="text-gray-700 font-semibold">$${(item.quantity * item.price).toFixed(2)}</p>
          `;
          orderDetailsContainer.appendChild(itemElement);
        });

        const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        orderTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
        orderConfirmedModal.classList.remove('hidden');
      }

      const closeModalButton = document.getElementById('closeModalBtn');
      closeModalButton.addEventListener('click', () => {
        orderConfirmedModal.classList.add('hidden');
      });

      startNewOrderButton.addEventListener('click', () => {
        orderConfirmedModal.classList.add('hidden');
        cartItems.length = 0;
        updateCart();
      });

      // Fungsi untuk memilih gambar berdasarkan ukuran viewport
      function getImageSrc(image) {
        const width = window.innerWidth;
        if (width >= 1024) {
          return image.desktop;
        } else if (width >= 968) {
          return image.tablet;
        } else {
          return image.mobile;
        }
      }

      // Load dan tampilkan data dessert
      data.forEach(dessert => {
        const dessertItem = document.createElement('div');
        dessertItem.classList.add('p-4');
        const imageSrc = getImageSrc(dessert.image);

        dessertItem.innerHTML = `
          <div class="relative">
            <img src="${imageSrc}" alt="${dessert.name}" class="w-full h-full object-cover aspect-square rounded-md">
            <button class="bg-white border-solid border-2 border-Rose/300 py-2 px-2 rounded-full flex items-center justify-center w-7/12 space-x-2 absolute bottom-[5px] left-1/2 transform -translate-x-1/2 translate-y-1/2 add-to-cart-btn" data-id="${dessert.id}">
              <img src="./assets/images/icon-add-to-cart.svg" alt="cart">
              <span class="text-Rose/500 font-bold">Add to Cart</span>
            </button>
          </div>
          <div class="mt-5">
            <p class="text-Rose/400 font-semibold">${dessert.category}</p>
            <h2 class="text-lg font-semibold">${dessert.name}</h2>
            <p class="text-[#c13e1e] font-bold text-xl mb-2">$${dessert.price.toFixed(2)}</p>
          </div>
        `;

        dessertsContainer.appendChild(dessertItem);
        dessertItem.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(dessert));
      });

      // Update gambar saat ukuran viewport berubah
      window.addEventListener('resize', () => {
        document.querySelectorAll('.desserts-container img').forEach((img, index) => {
          img.src = getImageSrc(data[index].image);
        });
      });
    });
});
