// ===== Helpers =====
const money = (n) =>
  new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" }).format(n);

function el(tag, className, html) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

// ===== State =====
const cart = new Map();      // id -> { id, name, price, img, qty }
const wishlist = new Map();  // id -> { id, name, price, img }

// ===== DOM =====
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const wishlistList = document.getElementById("wishlistList");
const wishlistTotal = document.getElementById("wishlistTotal");

// ===== Render =====
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  for (const item of cart.values()) {
    total += item.price * item.qty;

    const row = el("div", "item");
    row.appendChild(Object.assign(document.createElement("img"), { src: item.img, alt: item.name }));

    const meta = el("div", "meta");
    meta.appendChild(el("div", "name", `${item.name} (${item.qty})`));
    meta.appendChild(el("div", "sub", `${money(item.price)} / stuk`));
    row.appendChild(meta);

    const btn = el("button", "remove", "Verwijder");
    btn.dataset.action = "remove-cart";
    btn.dataset.id = item.id;
    row.appendChild(btn);

    cartList.appendChild(row);
  }

  cartTotal.textContent = money(total);
}

function renderWishlist() {
  wishlistList.innerHTML = "";
  let total = 0;

  for (const item of wishlist.values()) {
    total += item.price;

    const row = el("div", "item");
    row.appendChild(Object.assign(document.createElement("img"), { src: item.img, alt: item.name }));

    const meta = el("div", "meta");
    meta.appendChild(el("div", "name", item.name));
    meta.appendChild(el("div", "sub", money(item.price)));
    row.appendChild(meta);

    const btn = el("button", "remove", "Verwijder");
    btn.dataset.action = "remove-wish";
    btn.dataset.id = item.id;
    row.appendChild(btn);

    wishlistList.appendChild(row);
  }

  wishlistTotal.textContent = money(total);
}

function syncWishButtons() {
  document.querySelectorAll(".wish").forEach((b) => {
    const id = b.dataset.id;
    const active = wishlist.has(id);
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

// ===== Actions =====
function addToCart(data) {
  const id = data.id;
  const price = Number(data.price);

  if (!cart.has(id)) {
    cart.set(id, { id, name: data.name, price, img: data.img, qty: 1 });
  } else {
    cart.get(id).qty += 1;
  }
  renderCart();
}

function toggleWish(data) {
  const id = data.id;
  const price = Number(data.price);

  if (wishlist.has(id)) wishlist.delete(id);
  else wishlist.set(id, { id, name: data.name, price, img: data.img });

  renderWishlist();
  syncWishButtons();
}

// ===== Events =====
document.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-cart");
  const wishBtn = e.target.closest(".wish");
  const removeBtn = e.target.closest(".remove");

  if (addBtn) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(addBtn.dataset);
    return;
  }

  if (wishBtn) {
    e.preventDefault();
    e.stopPropagation();
    toggleWish(wishBtn.dataset);
    return;
  }

  if (removeBtn) {
    e.preventDefault();
    e.stopPropagation();

    const id = removeBtn.dataset.id;
    if (removeBtn.dataset.action === "remove-cart") cart.delete(id);
    if (removeBtn.dataset.action === "remove-wish") wishlist.delete(id);

    renderCart();
    renderWishlist();
    syncWishButtons();
  }
});

 
// Init
renderCart();
renderWishlist();
syncWishButtons();

