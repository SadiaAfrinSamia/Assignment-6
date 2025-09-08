// Load Categories
const categoryList = document.getElementById("category-list");
const treeContainer = document.getElementById("tree-container");
const cartList = document.getElementById("cart-list");
const cartTotal = document.getElementById("cart-total");

let cart = [];

// Fetch categories
fetch("https://openapi.programming-hero.com/api/categories")
  .then(res => res.json())
  .then(data => {
    data.categories.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = cat.category;
      li.addEventListener("click", () => loadCategory(cat.id));
      categoryList.appendChild(li);
    });
  });

// Fetch category plants
function loadCategory(id) {
  treeContainer.innerHTML = "<p>Loading...</p>";
  fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    .then(res => res.json())
    .then(data => {
      displayTrees(data.data);
    });
}

// Display trees
function displayTrees(trees) {
  treeContainer.innerHTML = "";
  trees.forEach(tree => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}">
      <h4>${tree.name}</h4>
      <p>${tree.description.slice(0, 50)}...</p>
      <p><strong>${tree.price} Tk</strong></p>
      <button onclick="addToCart('${tree.name}', ${tree.price})">Add to Cart</button>
    `;
    treeContainer.appendChild(card);
  });
}

// Add to cart
function addToCart(name, price) {
  cart.push({ name, price });
  updateCart();
}

// Update cart
function updateCart() {
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} - ${item.price} Tk <button onclick="removeFromCart(${index})">❌</button>`;
    cartList.appendChild(li);
  });
  cartTotal.textContent = total;
}

// Remove from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}
