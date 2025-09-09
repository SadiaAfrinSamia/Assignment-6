const categoryList = document.getElementById("category-list");
const treeContainer = document.getElementById("tree-container");
const modalBody = document.getElementById("modal-body");

let cart = [];

/* ---------------------------
   Helpers: safe field access
---------------------------- */
const first = (...vals) => vals.find(v => v !== undefined && v !== null && v !== "") ;

const normalizeCategories = (payload) => {
  const raw = Array.isArray(payload?.categories)
    ? payload.categories
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
    ? payload
    : [];

  // Map to { id, name }
  return raw.map(c => ({
    id: first(c.id, c.category_id, c.categoryId, c._id, c.slug, c.code, c.value),
    name: first(c.category, c.category_name, c.name, c.title, "Unknown"),
  })).filter(c => c.id !== undefined);
};

const normalizePlants = (payload) => {
  const raw = Array.isArray(payload?.plants)
    ? payload.plants
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
    ? payload
    : [];

  console.log("Raw plants data:", raw); // ✅ Debug log

  return raw.map(p => {
    const id = p.plantId || p.plant_id || p.id || p._id; 
    console.log("Plant ID extracted:", id); // ✅ Debug log
    console.log("Raw plant object:", p); // 👈 Add this
    console.log("Extracted ID:", id);    // 👈 And this
    const name = p.name || p.plant_name || "Unnamed";
    const description = p.description || p.details || "";
    const category = p.category || p.category_name || "General";
    const price = Number(p.price || p.price_bdt || 0);
    const image = p.image || p.img || p.thumbnail || p.image_url || 
      "https://via.placeholder.com/400x250?text=No+Image";

    return { id, name, description, category, price, image };
  });
};



/* ---------------------------
   UI helpers
---------------------------- */
function setActiveCategory(selected) {
  document.querySelectorAll("#category-list li").forEach(li => li.classList.remove("active"));
  selected.classList.add("active");
}

function showGridLoading() {
  treeContainer.innerHTML = `<p style="text-align:center;padding:20px;">Loading...</p>`;
}

function showCategoriesLoading() {
  categoryList.innerHTML = `<li>Loading...</li>`;
}

/* ---------------------------
   Fetchers
---------------------------- */
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ---------------------------
   Categories
---------------------------- */
async function loadCategories() {
  try {
    showCategoriesLoading();
    const raw = await fetchJSON("https://openapi.programming-hero.com/api/categories");
    const cats = normalizeCategories(raw);

    categoryList.innerHTML = "";

    // "All Trees"
    const allLi = document.createElement("li");
    allLi.textContent = "All Trees";
    allLi.classList.add("active");
    allLi.onclick = () => {
      setActiveCategory(allLi);
      loadAllTrees();
    };
    categoryList.appendChild(allLi);

    // Real categories
    cats.forEach(cat => {
      const li = document.createElement("li");
      li.textContent = cat.name;
      li.onclick = () => {
        setActiveCategory(li);
        loadTreesByCategory(cat.id);
      };
      categoryList.appendChild(li);
    });
  } catch (e) {
    console.error(e);
    categoryList.innerHTML = `<li>Failed to load categories</li>`;
  }
}

/* ---------------------------
   Plants (all / by category)
---------------------------- */
async function loadAllTrees() {
  try {
    showGridLoading();
    const raw = await fetchJSON("https://openapi.programming-hero.com/api/plants");
    const plants = normalizePlants(raw);
    displayTrees(plants);
  } catch (e) {
    console.error(e);
    treeContainer.innerHTML = `<p style="text-align:center;padding:20px;">Failed to load trees.</p>`;
  }
}

async function loadTreesByCategory(categoryId) {
  try {
    showGridLoading();
    const raw = await fetchJSON(`https://openapi.programming-hero.com/api/category/${categoryId}`);
    const plants = normalizePlants(raw);
    displayTrees(plants);
  } catch (e) {
    console.error(e);
    treeContainer.innerHTML = `<p style="text-align:center;padding:20px;">Failed to load category trees.</p>`;
  }
}

/* ---------------------------
   Render cards
---------------------------- */
function displayTrees(trees) {
  treeContainer.innerHTML = "";

  if (!trees || trees.length === 0) {
    treeContainer.innerHTML = `<p style="text-align:center;padding:20px;">No trees found.</p>`;
    return;
  }

  trees.forEach(tree => {
    console.log("Tree data:", tree); // ✅ Debugging ID

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${tree.image}" alt="${tree.name}" />
      <h4 onclick="showModal('${tree.id}')">${tree.name}</h4>
      <p>${(tree.description || "").slice(0, 60)}...</p>
      <span class="category-tag">${tree.category}</span>
      <p><strong>৳${tree.price}</strong></p>
      <button onclick="addToCart('${tree.name.replace(/'/g, "\\'")}', ${Number(tree.price) || 0})">Add to Cart</button>
    `;
    treeContainer.appendChild(card);
  });
}



/* ---------------------------
   Modal (details)
---------------------------- */
async function showModal(id) {
  const modal = document.getElementById("tree-modal");
  modal.style.display = "flex";
  modalBody.innerHTML = `<p style="text-align:center;padding:20px;">Loading...</p>`;

  try {
    const raw = await fetchJSON(`https://openapi.programming-hero.com/api/plant/${id}`);
    // The detail API structure: { plant: {...} }
    const plant = raw?.plant || raw?.data || raw;

    if (!plant || (!plant.name && !plant.plant_name)) {
      modalBody.innerHTML = `<p style="text-align:center;">Tree details not found.</p>`;
      return;
    }

    // Access fields directly from the detail response
    const name = plant.name || plant.plant_name || "Unnamed";
    const description = plant.description || plant.details || "No description available.";
    const category = plant.category || plant.category_name || "General";
    const price = plant.price || plant.price_bdt || 0;
    const image = plant.image || plant.img || plant.thumbnail || "https://via.placeholder.com/400x250?text=No+Image";

    modalBody.innerHTML = `
      <h2>${name}</h2>
      <img src="${image}" alt="${name}" style="max-width:100%;border-radius:8px;margin:10px 0;">
      <p>${description}</p>
      <p><strong>Category:</strong> ${category}</p>
      <p><strong>Price:</strong> ৳${price}</p>
    `;
  } catch (e) {
    console.error(e);
    modalBody.innerHTML = `<p style="text-align:center;color:red;">Failed to load details.</p>`;
  }
}


/* ---------------------------
   Cart
---------------------------- */
function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, qty: 1 });
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} ৳${item.price} × ${item.qty}
      <button onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">❌</button>
    `;
    cartList.appendChild(li);
  });

  document.getElementById("cart-total").textContent = total;
}

function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  updateCart();
}

/* ---------------------------
   Init
---------------------------- */
loadCategories();
loadAllTrees();

// Expose functions used by inline onclick
window.showModal = showModal;
window.closeModal = closeModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;



