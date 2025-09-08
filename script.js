const categories = [
  "All Trees", "Fruit Trees", "Flowering Trees", "Shade Trees",
  "Medicinal Trees", "Timber Trees", "Evergreen Trees",
  "Ornamental Plants", "Bamboo", "Climbers", "Aquatic Plants"
];

const trees = [
  {
    name: "Mango Tree",
    description: "A fast-growing tropical tree producing delicious mangoes.",
    category: "Fruit Trees",
    price: 500,
    image: "images/mango.jpg"
  },
  {
    name: "Guava Tree",
    description: "A hardy fruit tree with nutritious guavas.",
    category: "Fruit Trees",
    price: 400,
    image: "images/guava.jpg"
  },
  {
    name: "Guava Tree",
    description: "A hardy fruit tree with nutritious guavas.",
    category: "Fruit Trees",
    price: 400,
    image: "images/guava.jpg"
  },
  {
    name: "Guava Tree",
    description: "A hardy fruit tree with nutritious guavas.",
    category: "Fruit Trees",
    price: 400,
    image: "images/guava.jpg"
  },
  {
    name: "Guava Tree",
    description: "A hardy fruit tree with nutritious guavas.",
    category: "Fruit Trees",
    price: 400,
    image: "images/guava.jpg"
  },
  {
    name: "Guava Tree",
    description: "A hardy fruit tree with nutritious guavas.",
    category: "Fruit Trees",
    price: 400,
    image: "images/guava.jpg"
  },
  {
    name: "Guava Tree",
    description: "A hardy fruit tree with nutritious guavas.",
    category: "Fruit Trees",
    price: 400,
    image: "images/guava.jpg"
  },
  {
    name: "Guava Tree",
    description: "A hardy fruit tree with nutritious guavas.",
    category: "Fruit Trees",
    price: 400,
    image: "images/guava.jpg"
  },
  {
    name: "Guava Tree",
    description: "A hardy fruit tree with nutritious guavas.",
    category: "Fruit Trees",
    price: 400,
    image: "images/guava.jpg"
  }
  // ➕ Add more tree objects here
];

let cart = [];

// Load categories dynamically
function loadCategories() {
  const categoryList = document.getElementById("category-list");
  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const li = document.createElement("li");
    li.textContent = cat;
    li.onclick = () => {
      document
        .querySelectorAll("#category-list li")
        .forEach(el => el.classList.remove("active"));
      li.classList.add("active");
      loadTrees(cat);
    };
    categoryList.appendChild(li);
  });
}

// Load trees for a category
function loadTrees(category) {
  const container = document.getElementById("tree-container");
  container.innerHTML = "";
  const filtered =
    category === "All Trees"
      ? trees
      : trees.filter(t => t.category === category);

  filtered.forEach(tree => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" />
      <h4 onclick="showModal('${tree.name}')">${tree.name}</h4>
      <p>${tree.description.slice(0, 60)}...</p>
      <span class="badge">${tree.category}</span>
      <p><strong>৳${tree.price}</strong></p>
      <button onclick="addToCart('${tree.name}')">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

// Show modal with tree details
function showModal(name) {
  const tree = trees.find(t => t.name === name);
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = `
    <h2>${tree.name}</h2>
    <img src="${tree.image}" alt="${tree.name}" />
    <p>${tree.description}</p>
    <p><strong>Category:</strong> ${tree.category}</p>
    <p><strong>Price:</strong> ৳${tree.price}</p>
  `;
  document.getElementById("tree-modal").style.display = "block";
}

function closeModal() {
  document.getElementById("tree-modal").style.display = "none";
}

// Add to cart
function addToCart(name) {
  const tree = trees.find(t => t.name === name);
  const existing = cart.find(c => c.name === tree.name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...tree, qty: 1 });
  }
  updateCart();
}

// Update cart
function updateCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} ৳${item.price} × ${item.qty}
      <button onclick="removeFromCart('${item.name}')">❌</button>
    `;
    cartList.appendChild(li);
  });
  document.getElementById("cart-total").textContent = total;
}

// Remove from cart
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  updateCart();
}

// Init
loadCategories();
loadTrees("All Trees");
