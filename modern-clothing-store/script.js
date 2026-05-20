/**
 * Simple E-Commerce Frontend Logic
 * Concepts: State, LocalStorage, DOM Manipulation, Event Handling
 */

const app = {
    // State
    data: {
        products: [],
        cart: [],
        orders: []
    },

    // UI References
    dom: {
        productGrid: document.getElementById('product-grid'),
        cartOverlay: document.getElementById('cart-overlay'),
        cartItems: document.getElementById('cart-items'),
        cartCount: document.getElementById('cart-count'),
        cartTotal: document.getElementById('cart-total-price'),
        views: {
            home: document.getElementById('home-view'),
            detail: document.getElementById('product-detail-view'),
            orders: document.getElementById('orders-view'),
            admin: document.getElementById('admin-view')
        }
    },

    // Initialization
    init: function () {
        this.loadData();
        this.setupEventListeners();
        this.renderProducts('all');
        this.updateCartUI();
    },

    loadData: function () {
        // Load products
        const storedProducts = localStorage.getItem('products_v5');
        if (storedProducts) {
            this.data.products = JSON.parse(storedProducts);
        } else {
            // Seed initial data if empty
            this.data.products = [
                {
                    id: 1,
                    name: "Classic White Tee",
                    price: 24.99,
                    category: "men",
                    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "A timeless classic. 100% Cotton, perfect for everyday wear."
                },
                {
                    id: 2,
                    name: "Denim Jacket",
                    price: 89.99,
                    category: "men",
                    image: "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Vintage style denim jacket. Rugged and stylish."
                },
                {
                    id: 3,
                    name: "Summer Floral Dress",
                    price: 59.99,
                    category: "women",
                    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Lightweight and breezy, perfect for summer days."
                },
                {
                    id: 4,
                    name: "Urban Hoodie",
                    price: 49.99,
                    category: "women",
                    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Cozy and comfortable hoodie for urban living."
                },
                {
                    id: 5,
                    name: "Kids Graphic Tee",
                    price: 19.99,
                    category: "kids",
                    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Cool graphic t-shirt for the little ones."
                },
                {
                    id: 6,
                    name: "Elegant Silk Blouse",
                    price: 79.99,
                    category: "women",
                    image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Sophisticated silk blouse for office or evening wear."
                },
                {
                    id: 7,
                    name: "Men's Chino Pants",
                    price: 45.00,
                    category: "men",
                    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Versatile chinos that go with everything."
                },
                {
                    id: 8,
                    name: "Kids Winter Puffer",
                    price: 55.00,
                    category: "kids",
                    image: "https://placehold.co/800x600/FFC107/000000?text=Kids+Winter+Puffer",
                    description: "Warm and cozy yellow puffer jacket for cold days."
                },
                {
                    id: 11,
                    name: "Striped Cotton Shirt",
                    price: 35.00,
                    category: "kids",
                    image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    description: "Comfy striped shirt for playdates."
                },
                {
                    id: 12,
                    name: "Wool Scarf",
                    price: 25.00,
                    category: "women",
                    image: "https://placehold.co/800x600/E0E0E0/333333?text=Wool+Scarf",
                    description: "Soft wool scarf to keep you warm in style."
                }
            ];
            this.saveProducts();
        }

        // Load Cart
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.data.cart = JSON.parse(storedCart);
        }

        // Load Orders
        const storedOrders = localStorage.getItem('orders');
        if (storedOrders) {
            this.data.orders = JSON.parse(storedOrders);
        }
    },

    saveProducts: function () {
        localStorage.setItem('products_v5', JSON.stringify(this.data.products));
    },

    saveCart: function () {
        localStorage.setItem('cart', JSON.stringify(this.data.cart));
        this.updateCartUI();
    },

    saveOrders: function () {
        localStorage.setItem('orders', JSON.stringify(this.data.orders));
    },

    // Navigation & Views
    navigate: function (viewName) {
        // Hide all views
        Object.values(this.dom.views).forEach(el => el.classList.add('hidden'));
        Object.values(this.dom.views).forEach(el => el.classList.remove('active'));

        // Show requested view
        const target = viewName === 'home' ? this.dom.views.home :
            viewName === 'orders' ? this.dom.views.orders :
                viewName === 'admin' ? this.dom.views.admin : null;

        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
            window.scrollTo(0, 0);
        }

        if (viewName === 'orders') this.renderOrders();
        if (viewName === 'admin') this.renderAdmin();
    },

    // ----------------------
    // Product Logic
    // ----------------------
    renderProducts: function (category) {
        this.navigate('home');
        this.dom.productGrid.innerHTML = '';

        const filtered = category === 'all'
            ? this.data.products
            : this.data.products.filter(p => p.category === category);

        if (filtered.length === 0) {
            this.dom.productGrid.innerHTML = '<p>No products found in this category.</p>';
            return;
        }

        filtered.forEach(p => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img-container">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <div class="product-info">
                    <div class="product-category">${p.category}</div>
                    <div class="product-title">${p.name}</div>
                    <div class="product-price">$${p.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn outline" onclick="app.viewProduct(${p.id})">View Details</button>
                        <button class="btn primary" onclick="app.addToCart(${p.id})"><i class="fa-solid fa-cart-plus"></i></button>
                    </div>
                </div>
            `;
            this.dom.productGrid.appendChild(card);
        });
    },

    filterCategory: function (cat) {
        this.renderProducts(cat);
    },

    viewProduct: function (id) {
        const product = this.data.products.find(p => p.id === id);
        if (!product) return;

        // Populate detail view
        const container = document.getElementById('product-detail-content');
        container.innerHTML = `
            <div class="detail-img">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="detail-info">
                <h2>${product.name}</h2>
                <div class="detail-price">$${product.price.toFixed(2)}</div>
                <p class="detail-desc">${product.description}</p>
                <div class="detail-actions">
                    <button class="btn primary" onclick="app.addToCart(${product.id})">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        // Switch View
        Object.values(this.dom.views).forEach(el => el.classList.add('hidden'));
        this.dom.views.detail.classList.remove('hidden');
        window.scrollTo(0, 0);
    },

    // ----------------------
    // Cart Logic
    // ----------------------
    toggleCart: function () {
        this.dom.cartOverlay.classList.toggle('hidden');
    },

    addToCart: function (id) {
        const existing = this.data.cart.find(item => item.productId === id);
        if (existing) {
            existing.quantity++;
        } else {
            this.data.cart.push({ productId: id, quantity: 1 });
        }
        this.saveCart();
        this.showToast('Added to cart');
    },

    updateCartUI: function () {
        const count = this.data.cart.reduce((sum, item) => sum + item.quantity, 0);
        this.dom.cartCount.innerText = count;

        this.dom.cartItems.innerHTML = '';
        let total = 0;

        if (this.data.cart.length === 0) {
            this.dom.cartItems.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        } else {
            this.data.cart.forEach(item => {
                const product = this.data.products.find(p => p.id === item.productId);
                if (!product) return; // Should not happen

                const itemTotal = product.price * item.quantity;
                total += itemTotal;

                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${product.name}</div>
                        <div class="cart-item-price">$${product.price.toFixed(2)} x ${item.quantity}</div>
                        <div class="cart-item-controls">
                            <div class="qty-btn-group">
                                <button class="qty-btn" onclick="app.changeQty(${item.productId}, -1)">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-btn" onclick="app.changeQty(${item.productId}, 1)">+</button>
                            </div>
                            <button class="remove-btn" onclick="app.removeFromCart(${item.productId})">Remove</button>
                        </div>
                    </div>
                `;
                this.dom.cartItems.appendChild(el);
            });
        }

        this.dom.cartTotal.innerText = '$' + total.toFixed(2);
    },

    changeQty: function (id, delta) {
        const item = this.data.cart.find(i => i.productId === id);
        if (!item) return;

        item.quantity += delta;
        if (item.quantity < 1) {
            this.removeFromCart(id);
        } else {
            this.saveCart();
        }
    },

    removeFromCart: function (id) {
        this.data.cart = this.data.cart.filter(i => i.productId !== id);
        this.saveCart();
    },

    checkout: function () {
        if (this.data.cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        if (!confirm("Confirm Purchase?")) return;

        // Create Order
        const order = {
            id: 'ORD-' + Date.now().toString().slice(-6),
            date: new Date().toLocaleDateString(),
            items: [...this.data.cart], // Clone
            total: this.calculateCartTotal(),
            status: 'Delivered'
        };

        this.data.orders.unshift(order); // Add to beginning
        this.saveOrders();

        // Clear Cart
        this.data.cart = [];
        this.saveCart();
        this.toggleCart();

        // Show success and Orders
        alert("Thank you for your purchase!");
        this.navigate('orders');
    },

    calculateCartTotal: function () {
        return this.data.cart.reduce((sum, item) => {
            const p = this.data.products.find(prod => prod.id === item.productId);
            return sum + (p ? p.price * item.quantity : 0);
        }, 0);
    },

    // ----------------------
    // Orders Logic
    // ----------------------
    renderOrders: function () {
        const container = document.getElementById('orders-list');
        container.innerHTML = '';

        if (this.data.orders.length === 0) {
            container.innerHTML = '<p>No past orders.</p>';
            return;
        }

        this.data.orders.forEach(order => {
            // Build items list
            const itemsHtml = order.items.map(i => {
                const p = this.data.products.find(prod => prod.id === i.productId);
                return p ? `<li><span>${p.name} x${i.quantity}</span> <span>$${(p.price * i.quantity).toFixed(2)}</span></li>` : '';
            }).join('');

            const el = document.createElement('div');
            el.className = 'order-card';
            el.innerHTML = `
                <div class="order-header">
                    <span class="order-id">#${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-items">
                    <ul>${itemsHtml}</ul>
                </div>
                <div class="order-footer">
                    <span class="order-total">Total: $${order.total.toFixed(2)}</span>
                    <div>
                        <span class="order-status ${order.status === 'Delivered' ? 'status-delivered' : 'status-return'}">${order.status}</span>
                        ${order.status === 'Delivered' ? `<button class="btn outline" style="font-size:0.8rem; margin-left:10px" onclick="app.returnOrder('${order.id}')">Return</button>` : ''}
                    </div>
                </div>
            `;
            container.appendChild(el);
        });
    },

    returnOrder: function (orderId) {
        if (!confirm("Are you sure you want to request a return for this order?")) return;

        const order = this.data.orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'Return Requested';
            this.saveOrders();
            this.renderOrders();
        }
    },

    // ----------------------
    // Admin Logic
    // ----------------------
    renderAdmin: function () {
        const list = document.getElementById('admin-product-list');
        list.innerHTML = '';

        this.data.products.forEach(p => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${p.name} ($${p.price})</span>
                <button onclick="app.deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
            `;
            list.appendChild(li);
        });
    },

    addProduct: function (e) {
        e.preventDefault();
        const name = document.getElementById('p-name').value;
        const price = parseFloat(document.getElementById('p-price').value);
        const category = document.getElementById('p-category').value;
        const image = document.getElementById('p-image').value;
        const desc = document.getElementById('p-desc').value;

        const newProduct = {
            id: Date.now(),
            name,
            price,
            category,
            image,
            description: desc
        };

        this.data.products.push(newProduct);
        this.saveProducts();

        e.target.reset();
        this.renderAdmin();
        this.showToast('Product added successfully');
    },

    deleteProduct: function (id) {
        if (!confirm("Delete this product?")) return;
        this.data.products = this.data.products.filter(p => p.id !== id);
        this.saveProducts();
        this.renderAdmin();
    },

    // ----------------------
    // Utils
    // ----------------------
    showToast: function (msg) {
        const toast = document.getElementById('toast');
        toast.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3000);
    },

    setupEventListeners: function () {
        // Form submission for admin
        document.getElementById('add-product-form').addEventListener('submit', (e) => this.addProduct(e));

        // Mobile Menu Toggle
        document.querySelector('.mobile-menu-btn').addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
        });
    }
};

// Start App
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
