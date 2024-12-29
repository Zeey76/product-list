const dessertMenu = document.querySelector(".desserts");
const cartSection = document.querySelector(".cart-section");
const orderConfirmation = document.querySelector(".order-confirmation-wrapper");
const confirmedOrder = document.querySelector(".order-confirmation-content");
let cart = [];

async function fetchData() {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      console.log("Something went wrong");
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return [];
  }
}

async function renderMenu() {
  const data = await fetchData();
  if (data.length === 0) return;
  dessertMenu.innerHTML = data.map((item) => createDessertHTML(item)).join("");
  cartSection.innerHTML = cartContent();
  attachMenuEventListeners();
}

function createDessertHTML(item) {
  const serializedItem = encodeURIComponent(JSON.stringify(item));
  return `
    <div class="dessert-item" data-item="${serializedItem}">
          <div class="relative inline-block mb-2">
            <img
              src="${item.image.desktop}"
              class="desktop-image dessert-img ${item.name}"
            />
            <img
              src="${item.image.mobile}"
              class="mobile-image dessert-img ${item.name}"
            />
            <img
              src="${item.image.tablet}"
              class="tablet-image dessert-img ${item.name}"
            />
            <img 
              src="${item.image.thumbnail}" 
              class="thumbnail-image hidden"
            />
            <button class="dessert-menu__button desert--button">
              <img src="./assets/images/icon-add-to-cart.svg" /><span class="text-rose900 font-semibold">Add to Cart</span
              >
            </button>
            <button
              class="dessert-menu__button dessert--quantity__button hide-btn"
            >
              <div class="reduce-quantity-btn">
                <img src="./assets/images/icon-decrement-quantity.svg" />
              </div>
              <p class="quantity">1</p>
              <div class="increase-quantity-btn">
                <img src="./assets/images/icon-increment-quantity.svg" />
              </div>
            </button>
          </div>
          <div class="dessert-info">
            <p class="dessert-menu__category text-rose400 font-medium">${item.category}</p>
            <h3 class="dessert-menu__title font-bold text-rose900 ">${item.name}</h3>
            <p class="dessert-menu__price text-red font-bold">$${item.price.toFixed(2)}</p>
          </div>
        </div>
       `;
}

function attachMenuEventListeners() {
  const dessertMenuItem = document.querySelectorAll(".dessert-item");
  dessertMenuItem.forEach((item) => {
    const addToCartBtn = item.querySelector(".desert--button");
    const quantityButton = item.querySelector(".dessert--quantity__button");
    const dessertImg = item.querySelectorAll(".dessert-img");
    const reduceQuantityButton = item.querySelector(".reduce-quantity-btn");
    const increaseQuantityButton = item.querySelector(".increase-quantity-btn");
    const quantity = item.querySelector(".quantity");
    addToCartBtn.addEventListener("click", () => {
      addToCart(item);
      toggleItemButtons(addToCartBtn, quantityButton, dessertImg, true);
    });
    increaseQuantityButton.addEventListener("click", () => {
      increaseQuantity(quantity);
      updateCartItemsQuantity(item, 1);
    });
    reduceQuantityButton.addEventListener("click", () => {
      reduceQuantity(item, quantity);
      updateCartItemsQuantity(item, -1);
    });
  });
}

function toggleItemButtons(addToCartBtn, quantityButton, dessertImg, isAdded) {
  addToCartBtn.classList.toggle("hide-btn", isAdded);
  quantityButton.classList.toggle("hide-btn", !isAdded);
  dessertImg.forEach((image) =>
    image.classList.toggle("selected-dessert", isAdded),
  );
}

function increaseQuantity(quantity) {
  quantity.textContent = parseInt(quantity.textContent) + 1;
}

function reduceQuantity(item, quantity) {
  if (quantity.textContent > 1) {
    quantity.textContent = parseInt(quantity.textContent) - 1;
  } else if (quantity.textContent <= 1) {
    reset(item);
    renderCartItems();
  }
}

function cartContent() {
  return `
    <div class="cart">
      <h3 class="cart__title text-xl text-red font-bold mb-2">Your Cart (<span class="cart-item-quantity">0</span>)</h3>
      <div class="cart--empty__content flex flex-col justify-center items-center gap-1.5">
        <img src="./assets/images/illustration-empty-cart.svg" class="cart__image" alt="Your cart is empty">
        <p class="cart__text text-rose500 font-semibold">Your added items will appear here</p> 
      </div>
      <div class="full-cart"></div>
    </div>
  `;
}

function addToCart(dessertItem) {
  const dessert = JSON.parse(
    decodeURIComponent(dessertItem.getAttribute("data-item")),
  );
  const name = dessert.name;
  const price = dessert.price.toFixed(2);
  const image = dessert.image.thumbnail;

  const newItem = {
    name,
    price,
    image,
    quantity: 1,
  };

  cart.push(newItem);
  renderCartItems();
}

function updateCartItemsQuantity(cartItem, quantity) {
  const dessert = JSON.parse(
    decodeURIComponent(cartItem.getAttribute("data-item")),
  );
  const itemIndex = cart.findIndex((item) => item.name === dessert.name);
  if (itemIndex !== -1) {
    cart[itemIndex].quantity += quantity;
    if (cart[itemIndex].quantity === 0) {
      cart.splice(itemIndex, 1);
    }
  }
  renderCartItems();
}

function renderCartItems() {
  const emptyCart = document.querySelector(".cart--empty__content");
  const fullCart = document.querySelector(".full-cart");
  const cartItemQuantity = document.querySelector(".cart-item-quantity");
  fullCart.innerHTML = "";

  if (cart.length === 0) {
    emptyCart.classList.remove("hide");
    cartItemQuantity.innerHTML = 0;
    return;
  }
  emptyCart.classList.add("hide");
  cartItemQuantity.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  let totalPrice = 0;
  const cartHTML = cart.map((item) => createCartItemHTML(item)).join("");
  totalPrice += cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );
  fullCart.innerHTML = `
        ${cartHTML}
        <div class="flex justify-between items-center mt-0.5 mb-1">
          <p class="text-rose400">Order Total</p>
          <p class="cart__total--price text-rose900 font-bold text-2xl">$${totalPrice.toFixed(2)}</p>
        </div>
        <div class="bg-rose100 flex justify-center gap-0.5 rounded-md p-1 mb-1.5">
          <img src="./assets/images/icon-carbon-neutral.svg"><p class="text-sm text-rose900">This is a <span class="font-bold">carbon-neutral</span> delivery</p>
        </div>
        <button class="cart__confirm-order bg-red text-rose50 rounded-full w-full p-0.5">Confirm Order</button>
    `;
  attachCartEventListeners();
}

function createCartItemHTML(cartItem) {
  return `
    <div class="cart__item flex justify-between items-center">
        <div class="cart__item--details flex flex-col gap-0.5">
          <h4 class="cart__item--title text-rose900 text-sm font-semibold">${cartItem.name}</h4>
          <p class="cart__item--total">
            <span class="cart__item--quantity mr-0.5 text-red">
              ${cartItem.quantity}x
            </span>
            <span class="cart__item--price text-sm text-rose400">
              @ $${Number(cartItem.price).toFixed(2)}
            </span>
            <span class="cart__item--total-price text-sm text-rose400 font-medium">
              $${(Number(cartItem.price) * cartItem.quantity).toFixed(2)}
            </span>
          </p>
        </div>
        <div>
          <button><img src="./assets/images/icon-remove-item.svg" class="cart__item--remove" data-name="${cartItem.name}"></button>
        </div>
      </div>
        <hr class="mt-1 mb-1">
  `;
}

function attachCartEventListeners() {
  cartSection.addEventListener("click", (event) => {
    if (event.target.classList.contains("cart__item--remove")) {
      const itemName = event.target.getAttribute("data-name");
      removeCartItem(itemName);
    }
    if (event.target.classList.contains("cart__confirm-order")) {
      confirmOrder();
    }
  });
}

function removeCartItem(itemName) {
  const itemIndex = cart.findIndex((item) => item.name === itemName);
  if (itemIndex !== -1) {
    cart.splice(itemIndex, 1);
    const dessertItem = [...document.querySelectorAll(".dessert-item")].find(
      (item) => {
        const dessertData = JSON.parse(
          decodeURIComponent(item.getAttribute("data-item")),
        );
        return dessertData.name === itemName;
      },
    );

    if (dessertItem) {
      reset(dessertItem);
    }
    renderCartItems();
  }
}

function confirmOrder() {
  orderConfirmation.classList.remove("hide");
  confirmedOrder.innerHTML = "";
  confirmedOrder.innerHTML = `
     <img src="./assets/images/icon-order-confirmed.svg" class="w-3">
      <div class="order-confirmation__heading">
        <h2 class="mb-0.5 text-rose900 text-2xl font-bold">Order Confirmed</h2>
        <p class="text-rose500">We hope you enjoy your food</p>
      </div>
      <div class="confirmed-items bg-rose100 p-1 rounded-md">
        <div class="confirmed-items-list overflow-y-auto custom-scrollbar">
        
        </div>
        <div class="order-total flex justify-between mt-0.5 mb-0.5">
          <p>Order Total</p>
          <p class="order-total-price text-rose900 font-bold text-2xl"></p>
        </div>
      </div>
      <button class="start-new-order bg-red text-rose50 rounded-full w-full p-0.5">Start New Order</button>
  `;
  confirmedItems();
  startNewOrder();
}

function confirmedItems() {
  const confirmedCartItems = document.querySelector(".confirmed-items-list");
  const totalOrderPrice = document.querySelector(".order-total-price");
  let totalPrice = 0;
  cart.forEach((item) => {
    totalPrice += Number(item.price) * item.quantity;
    confirmedCartItems.innerHTML += `
        <div class="confirmed-item flex gap-0.5 items-center">
          <img src="${item.image}" class="w-3 h-3 rounded-md">
          <div class="confirmed-order">
            <h4 class="font-semibold">${item.name}</h4>
            <p><span class="text-red mr-0.5 text-sm">${item.quantity}x</span><span class="text-sm">@$${Number(item.price).toFixed(2)}</span></p>
          </div>
          <p class="total ml-auto">$${(Number(item.price) * item.quantity).toFixed(2)}</p>
        </div>
        <hr class="mt-1 mb-1">
  `;
  });
  totalOrderPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

function startNewOrder() {
  document.querySelector(".start-new-order").addEventListener("click", () => {
    orderConfirmation.classList.add("hide");
    cart = [];
    renderCartItems();
    reset();
  });
}

function reset(item = null) {
  if (item) {
    // Reset a specific item
    const addToCartBtn = item.querySelector(".desert--button");
    const quantityButton = item.querySelector(".dessert--quantity__button");
    const dessertImg = item.querySelectorAll(".dessert-img");

    addToCartBtn.classList.remove("hide-btn");
    quantityButton.classList.add("hide-btn");
    dessertImg.forEach((image) => image.classList.remove("selected-dessert"));
  } else {
    // Reset all items
    document.querySelectorAll(".dessert-item").forEach((dessert) => {
      const addToCartBtn = dessert.querySelector(".desert--button");
      const quantityButton = dessert.querySelector(
        ".dessert--quantity__button",
      );
      const dessertImg = dessert.querySelectorAll(".dessert-img");

      addToCartBtn.classList.remove("hide-btn");
      quantityButton.classList.add("hide-btn");
      dessertImg.forEach((image) => image.classList.remove("selected-dessert"));
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
});
