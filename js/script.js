const products = [
    { id: 1, name: "Reese's Puffs", category: "Kahvaltılık", price: 350, img: "img/reeses-puffs.webp" },
    { id: 2, name: "Cheetos Flamin' Hot", category: "Cips", price: 120, img: "img/cheetos.webp" },
    { id: 3, name: "Dr. Pepper Cherry", category: "İçecek", price: 60, img: "img/drpepper.webp" },
    { id: 4, name: "Sour Patch Kids", category: "Şekerleme", price: 90, img: "img/sour-patch.webp" },
    { id: 5, name: "Takis Fuego", category: "Cips", price: 140, img: "img/takis.webp" },
    { id: 6, name: "Prime Hydration Blue", category: "İçecek", price: 200, img: "img/prime.webp" },
    { id: 7, name: "Hershey's Cookies 'n' Creme", category: "Çikolata", price: 45, img: "img/hershey.webp" },
    { id: 8, name: "Monster Energy Bad Apple", category: "İçecek", price: 85, img: "img/monster.webp" }
];

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCartBadge();
    renderCartItems();
});

function displayProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;

    container.innerHTML = "";
    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <div class="card-header">
                <span class="category-tag">${product.category}</span>
                <img src="${product.img}" alt="${product.name}" onerror="this.src='https://placehold.co/200x200?text=Resim+Yok'">
            </div>
            <div class="card-body">
                <h3>${product.name}</h3>
                <div class="price-row">
                    <span class="price">${product.price} TL</span>
                    <button class="btn-add" onclick="addToCart(${product.id})">
                        <i class="fa-solid fa-plus"></i> Ekle
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('munchCart')) || [];
    cart.push(productId);
    localStorage.setItem('munchCart', JSON.stringify(cart));
    
    updateCartBadge();
    renderCartItems();
    showNotification("Ürün sepete eklendi! 🍪");
}

function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    
    if (forceOpen) {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    } else {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }
}

function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('munchCart')) || [];
    const container = document.getElementById('cart-items');
    const totalSpan = document.getElementById('cart-total-price');
    const countSpan = document.getElementById('cart-total-count');

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; margin-top:20px; color:#888;">Sepetin bomboş...</p>';
        totalSpan.innerText = '0 TL';
        countSpan.innerText = '0';
        return;
    }

    const itemCounts = {};
    cart.forEach(id => { itemCounts[id] = (itemCounts[id] || 0) + 1; });

    let html = '';
    let totalPrice = 0;

    for (const [id, qty] of Object.entries(itemCounts)) {
        const product = products.find(p => p.id == id);
        if (product) {
            totalPrice += product.price * qty;
            html += `
                <div class="cart-item">
                    <img src="${product.img}" alt="${product.name}" onerror="this.src='https://placehold.co/60x60'">
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <p>${product.price} TL x ${qty}</p>
                    </div>
                    <div class="item-controls">
                        <button class="btn-qty" onclick="changeQty(${product.id}, -1)">-</button>
                        <span>${qty}</span>
                        <button class="btn-qty" onclick="changeQty(${product.id}, 1)">+</button>
                        <button class="btn-remove" onclick="removeFromCart(${product.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }
    }
    container.innerHTML = html;
    totalSpan.innerText = totalPrice + ' TL';
    countSpan.innerText = cart.length;
}

function changeQty(productId, change) {
    let cart = JSON.parse(localStorage.getItem('munchCart')) || [];
    if (change === 1) {
        cart.push(productId);
    } else {
        const index = cart.indexOf(productId);
        if (index > -1) cart.splice(index, 1);
    }
    localStorage.setItem('munchCart', JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('munchCart')) || [];
    cart = cart.filter(id => id !== productId);
    localStorage.setItem('munchCart', JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('munchCart')) || [];
    const badge = document.getElementById('cart-count');
    if (badge) badge.innerText = cart.length;
}

function showNotification(message) {
    const x = document.getElementById("notification");
    x.innerText = message;
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}