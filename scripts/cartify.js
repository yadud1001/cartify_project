import {products} from "./products.js";
import {cart} from "./cart.js";

document.addEventListener('DOMContentLoaded', () => {
  /* Display the products */
  let productsHTML = '';

  products.forEach((product) => {
    productsHTML += `
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src="${product.image}">
        </div>

        <div class="product-name limit-text-to-2-lines">
          ${product.name}
        </div>

        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="public/images/icons/rating-${product.rating.stars}.png">
          <div class="product-rating-count">
            ${product.rating.count}
          </div>
        </div>

        <div class="product-price">
          ₱${product.price}
        </div>

        <div class="product-quantity-container">
          <select class="product-quantity js-quantity-selector-${product.id}">
            <option selected value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>

        <div class="add-to-cart-button-container">
          <button class="add-to-cart-button js-add-to-cart"
          data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  /* Display the cart quantity */
  document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
      button.addEventListener('click', () => {
        const productId = button.dataset.productId;
        const selector = document.querySelector(`.js-quantity-selector-${productId}`);
        const selectorQuantity = Number(selector.value);

        let matchingItem;

        cart.forEach((item) => {
          if (productId === item.productId) {
            matchingItem = item;
          }
        });

        if (matchingItem) {
          matchingItem.quantity += selectorQuantity;
        } else {
          cart.push({
            productId: productId,
            quantity: selectorQuantity
          });
        }

        let cartQuantity = 0;

        cart.forEach((item) => {
          cartQuantity += item.quantity;
        });

        document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
        selector.value = 1;
      });
    });

    /* For Checkout Modal */
    const cartIcon = document.querySelector(".js-cart-icon");
    const checkoutModal = document.querySelector(".checkout-container");
    const checkoutModalCloseButton = document.querySelector(".close");
    const body = document.body;

    /* To Display Items Added to Cart in the Checkout Modal */
    cartIcon.addEventListener("click", () => {
      checkoutModal.classList.add("open");
      body.classList.add("checkout-open");

      let cartOrdersHTML = '';
      let totalPrice = 0;

      cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        const subtotal = item.quantity * product.price;
        totalPrice += subtotal;

        cartOrdersHTML += `
          <tr class="cart-item">
            <td>
              <div class="cart-item-image-container">
              <img class="cart-item-image" src="${product.image}">
              </div>
            </td>

            <td>
              <div class="cart-item-name limit-text-to-2-lines">
              ${product.name}
              </div>
            </td>

            <td>
              <div class="cart-item-quantity">
              ${item.quantity}
              </div>
            </td>

            <td>
              <div class="cart-item-price">
              ₱${product.price}
              </div>
            </td>

            <td>
              <div class="cart-item-price">
              ₱${subtotal.toFixed(2)}
              </div>
            </td>
          </tr>
        `;
      });

      document.querySelector(".js-payment-details").innerHTML = cartOrdersHTML;

      document.querySelector(".js-subtotal").innerHTML = `₱${totalPrice.toFixed(2)}`;
      document.querySelector(".js-shipping-fee").innerHTML = `₱${(totalPrice * 0.1).toFixed(2)}`;
      document.querySelector(".js-total-payment").innerHTML = `₱${(totalPrice + (totalPrice * 0.1)).toFixed(2)}`;
    });

    /* Checkout Button Clicked */
    const checkoutButton = document.getElementById("checkout-button");
    const firstNameInput = document.getElementById("first-name");
    const lastNameInput = document.getElementById("last-name");   
    const contactNumInput = document.getElementById("contact-num");
    const addressInput = document.getElementById("address");   

    checkoutButton.addEventListener("click", () => {
      const firstName = firstNameInput.value;
      const lastName = lastNameInput.value;
      const contactNum = contactNumInput.value;
      const address = addressInput.value;
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

      if (firstName === "" || lastName === "" || contactNum === "" || address === "" || paymentMethod === "") {
        alert("Please fill in all the fields.");
        return;
      }

      if (cart.length > 0) {
        alert("Thank you for Cartifying with us! Your order has been placed.");

        cart.length = 0;
        document.querySelector(".js-cart-quantity").innerHTML = 0;
        document.querySelector(".js-payment-details").innerHTML = "";
        document.querySelector(".js-subtotal").innerHTML = "";
        document.querySelector(".js-shipping-fee").innerHTML = "";
        document.querySelector(".js-total-payment").innerHTML = "";

        firstNameInput.value = "";
        lastNameInput.value = "";
        contactNumInput.value = "";
        addressInput.value = "";

        body.classList.remove("checkout-open");
        checkoutModal.classList.remove("open");
      } else {
        alert("Your cart is empty. Please add items to your cart before checking out.");
      }
    });

    /* Close the Checkout Modal */
    checkoutModalCloseButton.addEventListener("click", () => {
      checkoutModal.classList.remove("open");
      body.classList.remove("checkout-open");
    });

    /* Close the Checkout Modal when clicking outside of it */
    window.addEventListener("click", (event) => {
      if (event.target === body) {
        checkoutModal.classList.remove("open");
        body.classList.remove("checkout-open");
      }
    });
});