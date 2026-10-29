/**
 * SUCHE MOTI (سچے موتی) — LUXURY CART & BAG DRAWER SYSTEM
 * Handles Slide-Out Drawer, LocalStorage, Packaging Tiers, & Free Delivery Meter
 */

const CartSystem = {
  items: [],
  selectedPackaging: 'standard', // 'standard', 'premium', 'gift'
  packagingPrices: {
    standard: 0,
    premium: 100,
    gift: 200
  },
  discountPercent: 0,
  FREE_SHIPPING_THRESHOLD_PKR: 3000,
  STANDARD_SHIPPING_PKR: 200,

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.render();
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('suche_moti_cart');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading cart:', e);
      this.items = [];
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem('suche_moti_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  },

  addItem(productId, quantity = 1) {
    const existing = this.items.find(item => item.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ productId, quantity });
    }
    this.saveToStorage();
    this.render();
    this.openDrawer();
    
    // Trigger toast notification
    const product = SUCHE_MOTI_PRODUCTS.find(p => p.id === productId);
    if (product && window.showToast) {
      window.showToast(`Added "${product.title}" to your Bag`);
    }
  },

  removeItem(productId) {
    this.items = this.items.filter(item => item.productId !== productId);
    this.saveToStorage();
    this.render();
  },

  updateQuantity(productId, delta) {
    const item = this.items.find(i => i.productId === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(productId);
        return;
      }
      this.saveToStorage();
      this.render();
    }
  },

  setPackaging(tier) {
    if (this.packagingPrices[tier] !== undefined) {
      this.selectedPackaging = tier;
      this.render();
    }
  },

  applyCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'SUCHE10') {
      this.discountPercent = 10;
      if (window.showToast) window.showToast('Promo Code Applied: 10% Off VIP Discount!');
      this.render();
      return true;
    } else if (cleanCode) {
      if (window.showToast) window.showToast('Invalid promo code. Try "SUCHE10"', true);
      return false;
    }
    return false;
  },

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer && backdrop) {
      drawer.classList.add('active');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    if (drawer && backdrop) {
      drawer.classList.remove('active');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  bindEvents() {
    // Open drawer buttons
    document.querySelectorAll('[data-action="open-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    });

    // Close drawer buttons
    document.querySelectorAll('[data-action="close-cart"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeDrawer();
      });
    });

    // Backdrop click
    const backdrop = document.getElementById('drawer-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.closeDrawer());
    }

    // Packaging option pills in cart
    document.querySelectorAll('.packaging-option-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        const tier = pill.getAttribute('data-packaging-tier');
        this.setPackaging(tier);
      });
    });

    // Promo code form
    const promoForm = document.getElementById('cart-promo-form');
    if (promoForm) {
      promoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('cart-promo-input');
        if (input) this.applyCoupon(input.value);
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (this.items.length === 0) {
          if (window.showToast) window.showToast('Your Bag is empty!', true);
          return;
        }
        this.closeDrawer();
        if (window.openCheckoutModal) {
          window.openCheckoutModal();
        }
      });
    }
  },

  render() {
    const isUSD = (window.currentCurrency === 'USD');
    const exchangeRate = 278; // 1 USD ~ 278 PKR

    const totalQty = this.items.reduce((sum, item) => sum + item.quantity, 0);

    // Update nav counters
    document.querySelectorAll('.cart-badge-count').forEach(el => {
      el.textContent = totalQty;
      el.style.display = totalQty > 0 ? 'flex' : 'none';
    });

    const cartCountEl = document.getElementById('cart-header-count');
    if (cartCountEl) {
      cartCountEl.textContent = `(${totalQty} ${totalQty === 1 ? 'Piece' : 'Pieces'})`;
    }

    // Cart items container
    const itemsContainer = document.getElementById('cart-items-list');
    const emptyState = document.getElementById('cart-empty-state');
    const cartFooter = document.getElementById('cart-footer-summary');

    if (!itemsContainer) return;

    if (this.items.length === 0) {
      itemsContainer.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      if (cartFooter) cartFooter.style.display = 'none';
      this.updateShippingMeter(0);
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    let subtotalPKR = 0;
    let itemsHTML = '';

    this.items.forEach(item => {
      const product = SUCHE_MOTI_PRODUCTS.find(p => p.id === item.productId);
      if (!product) return;

      const itemTotalPKR = product.pricePKR * item.quantity;
      subtotalPKR += itemTotalPKR;

      const displayPrice = isUSD 
        ? `$${Math.round(itemTotalPKR / exchangeRate)}` 
        : `₨ ${itemTotalPKR.toLocaleString()}`;

      itemsHTML += `
        <div class="cart-item-row" data-id="${product.id}">
          <img src="${product.primaryImg}" alt="${product.title}" class="cart-item-thumb">
          <div class="cart-item-info">
            <div>
              <h4 class="cart-item-title">${product.title}</h4>
              <p style="font-size: 0.75rem; color: var(--color-slate-400);">${product.pearlType}</p>
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
              <div class="cart-item-qty-controls">
                <button type="button" class="qty-btn" onclick="CartSystem.updateQuantity('${product.id}', -1)" aria-label="Decrease quantity">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn" onclick="CartSystem.updateQuantity('${product.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
              <span class="cart-item-price">${displayPrice}</span>
            </div>
          </div>
          <button type="button" class="cart-item-remove-btn" onclick="CartSystem.removeItem('${product.id}')" aria-label="Remove item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      `;
    });

    itemsContainer.innerHTML = itemsHTML;

    // Packaging cost calculation
    const packagingCostPKR = this.packagingPrices[this.selectedPackaging];
    
    // Free shipping calculation
    const isFreeShipping = subtotalPKR >= this.FREE_SHIPPING_THRESHOLD_PKR;
    const shippingCostPKR = isFreeShipping ? 0 : this.STANDARD_SHIPPING_PKR;

    // Discount
    const discountAmountPKR = Math.round((subtotalPKR * this.discountPercent) / 100);

    // Total
    const finalTotalPKR = subtotalPKR + packagingCostPKR + shippingCostPKR - discountAmountPKR;

    // Update shipping meter
    this.updateShippingMeter(subtotalPKR);

    // Update summary values
    const subtotalEl = document.getElementById('cart-subtotal-val');
    const shippingEl = document.getElementById('cart-shipping-val');
    const packagingEl = document.getElementById('cart-packaging-val');
    const discountRow = document.getElementById('cart-discount-row');
    const discountEl = document.getElementById('cart-discount-val');
    const totalEl = document.getElementById('cart-total-val');

    if (subtotalEl) {
      subtotalEl.textContent = isUSD ? `$${Math.round(subtotalPKR / exchangeRate)}` : `₨ ${subtotalPKR.toLocaleString()}`;
    }

    if (shippingEl) {
      shippingEl.textContent = isFreeShipping ? 'FREE (TCS/Leopards)' : (isUSD ? `$1` : `₨ ${this.STANDARD_SHIPPING_PKR}`);
      if (isFreeShipping) shippingEl.style.color = 'var(--color-success)';
      else shippingEl.style.color = '';
    }

    if (packagingEl) {
      packagingEl.textContent = packagingCostPKR === 0 ? 'Complimentary Pouch' : (isUSD ? `$1` : `+₨ ${packagingCostPKR}`);
    }

    if (discountRow && discountEl) {
      if (this.discountPercent > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = isUSD ? `-$${Math.round(discountAmountPKR / exchangeRate)}` : `-₨ ${discountAmountPKR.toLocaleString()}`;
      } else {
        discountRow.style.display = 'none';
      }
    }

    if (totalEl) {
      totalEl.textContent = isUSD ? `$${Math.round(finalTotalPKR / exchangeRate)}` : `₨ ${finalTotalPKR.toLocaleString()}`;
    }

    // Update active packaging pill in drawer
    document.querySelectorAll('.packaging-option-pill').forEach(pill => {
      const tier = pill.getAttribute('data-packaging-tier');
      if (tier === this.selectedPackaging) {
        pill.classList.add('selected');
      } else {
        pill.classList.remove('selected');
      }
    });
  },

  updateShippingMeter(subtotalPKR) {
    const meterFill = document.getElementById('shipping-meter-fill');
    const meterText = document.getElementById('shipping-meter-msg');

    if (!meterFill || !meterText) return;

    const remaining = this.FREE_SHIPPING_THRESHOLD_PKR - subtotalPKR;
    const percent = Math.min(100, Math.round((subtotalPKR / this.FREE_SHIPPING_THRESHOLD_PKR) * 100));

    meterFill.style.width = `${percent}%`;

    if (remaining <= 0) {
      meterText.innerHTML = `<strong>✨ Congratulations!</strong> You have unlocked <strong>Free Nationwide Express Delivery</strong>!`;
      meterFill.style.background = 'var(--color-success)';
    } else {
      const isUSD = (window.currentCurrency === 'USD');
      const formattedRemaining = isUSD ? `$${Math.round(remaining / 278)}` : `₨ ${remaining.toLocaleString()}`;
      meterText.innerHTML = `Add <strong>${formattedRemaining}</strong> more for <strong>Complimentary Insured Delivery</strong> across Pakistan`;
      meterFill.style.background = 'linear-gradient(90deg, var(--color-gold-500), var(--color-gold-400))';
    }
  }
};

window.CartSystem = CartSystem;
