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
        const dessertItemElement = document.querySelector(`.add-to-cart-btn[data-id="${dessert.id}"]`).parentElement;
        const dessertImage = document.querySelector(`img[alt="${dessert.name}"]`); // Ambil elemen gambar berdasarkan alt text

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cartItems.push({ ...dessert, quantity: 1 });
          
          dessertImage.classList.add('border-solid', 'border-4', 'border-[#c13e1e]');
          // Replace "Add to Cart" button with "+" and "-" buttons
          replaceAddToCartWithQuantityButtons(dessertItemElement, dessert);
        }
        updateCart();
      }

      function replaceAddToCartWithQuantityButtons(dessertItemElement, dessert) {
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('bg-Red', 'py-2', 'px-2', 'rounded-full', 'flex', 'items-center', 'justify-between', 'w-7/12', 'space-x-2', 'absolute', 'bottom-[5px]', 'left-1/2', 'transform', '-translate-x-1/2', 'translate-y-1/2');
        
        const minusButton = document.createElement('button');
        minusButton.classList.add('bg-transparent', 'border-solid', 'border-2', 'border-white', 'px-1', 'py-1', 'rounded-full'); // Optional: styling for the button
        minusButton.innerHTML = `
            <img src="./assets/images/icon-decrement-quantity.svg" alt="">`;
        minusButton.addEventListener('click', () => decreaseQuantity(dessert, quantityText));
    
        const quantityText = document.createElement('span');
        quantityText.textContent = '1';
        quantityText.classList.add('text-white');
    
        const plusButton = document.createElement('button');
        plusButton.classList.add('bg-transparent', 'border-solid', 'border-2', 'border-white', 'px-1', 'py-1', 'rounded-full'); // Optional: styling for the button
        plusButton.innerHTML = `
            <img src="./assets/images/icon-increment-quantity.svg" alt="">`;
        plusButton.addEventListener('click', () => increaseQuantity(dessert, quantityText));

        quantityContainer.appendChild(minusButton);
        quantityContainer.appendChild(quantityText);
        quantityContainer.appendChild(plusButton);

        dessertItemElement.querySelector('.add-to-cart-btn').replaceWith(quantityContainer);
      }

      function increaseQuantity(dessert, quantityText) {
        const existingItem = cartItems.find(item => item.id === dessert.id);
        if (existingItem) {
            existingItem.quantity += 1;
            updateCart();
            quantityText.textContent = existingItem.quantity; // Update displayed quantity
        }
      }
      
      function decreaseQuantity(dessert, quantityText) {
        const existingItem = cartItems.find(item => item.id === dessert.id);
        if (existingItem && existingItem.quantity > 1) {
            existingItem.quantity -= 1;
            updateCart();
            quantityText.textContent = existingItem.quantity; // Update displayed quantity
        } else if (existingItem && existingItem.quantity === 1) {
            // Remove item from cart if quantity is 0 and restore "Add to Cart" button
            removeFromCart(dessert.id);
            
        }
      }

      function createAddToCartButton(dessert) {
        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('bg-white', 'border-solid', 'border-2', 'border-Rose/300', 'py-2', 'px-2', 'rounded-full', 'flex', 'items-center', 'justify-center', 'w-7/12', 'space-x-2', 'absolute', 'bottom-[5px]', 'left-1/2', 'transform', '-translate-x-1/2', 'translate-y-1/2', 'add-to-cart-btn');
        addToCartButton.dataset.id = dessert.id;
        addToCartButton.innerHTML = `
          <img src="./assets/images/icon-add-to-cart.svg" alt="cart">
          <span class="text-Rose/500 font-bold">Add to Cart</span>
        `;
        addToCartButton.addEventListener('click', () => addToCart(dessert));
        return addToCartButton;
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

      function removeFromCart(dessertId) {
        const itemToRemove = cartItems.find(item => item.id === dessertId); // Temukan item yang akan dihapus
        if (itemToRemove) {
          // Temukan gambar yang sesuai dengan item yang dihapus
          const dessertImage = document.querySelector(`img[alt="${itemToRemove.name}"]`);
          if (dessertImage) {
            // Hapus kelas border dari gambar
            dessertImage.classList.remove('border-solid', 'border-4', 'border-[#c13e1e]');
          }
      
          // Mengembalikan tombol "Add to Cart"
          const dessertItemElement = dessertImage.closest('.p-4'); // Temukan elemen dessert yang sesuai
          const addToCartButton = createAddToCartButton(itemToRemove); // Buat tombol "Add to Cart"
          dessertItemElement.querySelector('.relative').appendChild(addToCartButton); // Tambahkan kembali tombol ke elemen dessert
        }
        
        cartItems = cartItems.filter(item => item.id !== dessertId); // Hapus item dari cart
        updateCart();
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

      // startNewOrderButton.addEventListener('click', () => {
      //   orderConfirmedModal.classList.add('hidden');
      //   cartItems.length = 0;
      //   updateCart();
      // });

      startNewOrderButton.addEventListener('click', () => {
        orderConfirmedModal.classList.add('hidden');
        // Kosongkan keranjang
        cartItems.length = 0;
      
        // Mengembalikan semua tombol "Add to Cart" untuk setiap dessert
        const dessertItems = document.querySelectorAll('.p-4'); // Menemukan semua item dessert
        dessertItems.forEach(dessertItem => {
          const dessertImage = dessertItem.querySelector('img'); // Menemukan gambar dessert
          const dessertName = dessertImage.alt; // Mendapatkan nama dessert dari atribut alt
          const dessertData = data.find(dessert => dessert.name === dessertName); // Mencari data dessert berdasarkan nama
      
          if (dessertData) {
            const addToCartButton = createAddToCartButton(dessertData); // Membuat tombol "Add to Cart"
            dessertItem.querySelector('.relative').appendChild(addToCartButton); // Menambahkan kembali tombol ke elemen dessert
      
            // Hapus border dari gambar dessert
            dessertImage.classList.remove('border-solid', 'border-4', 'border-[#c13e1e]'); // Pastikan untuk menghapus kelas border
          }
        });
        // Update tampilan keranjang
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
            </div>
            <div class="mt-5">
              <p class="text-Rose/400 font-semibold">${dessert.category}</p>
              <h2 class="text-lg font-semibold">${dessert.name}</h2>
              <p class="text-[#c13e1e] font-bold text-xl mb-2">$${dessert.price.toFixed(2)}</p>
            </div>
          `;
          
          // Tambahkan tombol "Add to Cart" dengan fungsi terpisah
          const addToCartButton = createAddToCartButton(dessert);
          dessertItem.querySelector('.relative').appendChild(addToCartButton);
          
          dessertsContainer.appendChild(dessertItem);
        });
    });
});
