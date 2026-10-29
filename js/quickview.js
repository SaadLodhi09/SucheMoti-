/**
 * SUCHE MOTI — QUICK VIEW MODAL
 * High-definition inspection & product specification sheet
 */

const QuickViewSystem = {
  currentProduct: null,
  quantity: 1,

  init() {
    this.bindEvents();
  },

  open(productId) {
    const product = SUCHE_MOTI_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    this.currentProduct = product;
    this.quantity = 1;
    this.render();

    const modal = document.getElementById('quickview-modal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  close() {
    const modal = document.getElementById('quickview-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  bindEvents() {
    // Quickview button clicks
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.card-quickview-btn, [data-action="quickview"]');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-product-id');
        this.open(id);
      }
    });

    // Close button
    const closeBtn = document.getElementById('quickview-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Modal backdrop click
    const modal = document.getElementById('quickview-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.close();
      });
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  },

  render() {
    if (!this.currentProduct) return;
    const p = this.currentProduct;
    const isUSD = (window.currentCurrency === 'USD');
    const exchangeRate = 278;

    const priceFormatted = isUSD
      ? `$${Math.round(p.pricePKR / exchangeRate)}`
      : `₨ ${p.pricePKR.toLocaleString()}`;

    // Set Main Image
    const mainImg = document.getElementById('quickview-main-image');
    if (mainImg) {
      mainImg.src = p.primaryImg;
      mainImg.alt = p.title;
    }

    // Thumbnails
    const thumbsWrap = document.getElementById('quickview-thumbnails');
    if (thumbsWrap) {
      thumbsWrap.innerHTML = `
        <button type="button" class="thumbnail-btn active" onclick="QuickViewSystem.switchImage('${p.primaryImg}', this)">
          <img src="${p.primaryImg}" alt="Angle 1">
        </button>
        <button type="button" class="thumbnail-btn" onclick="QuickViewSystem.switchImage('${p.hoverImg}', this)">
          <img src="${p.hoverImg}" alt="Angle 2">
        </button>
      `;
    }

    // Meta details
    document.getElementById('quickview-badge').textContent = p.badge;
    document.getElementById('quickview-title').textContent = p.title;
    document.getElementById('quickview-price').textContent = priceFormatted;
    document.getElementById('quickview-desc').textContent = p.description;

    // Specs
    document.getElementById('spec-origin').textContent = p.origin;
    document.getElementById('spec-pearl-type').textContent = p.pearlType;
    document.getElementById('spec-diameter').textContent = p.diameter;
    document.getElementById('spec-metal').textContent = p.metal;

    // Quantity Reset
    const qtyVal = document.getElementById('quickview-qty-val');
    if (qtyVal) qtyVal.textContent = '1';

    // Add to Bag Button
    const addBtn = document.getElementById('quickview-add-to-bag');
    if (addBtn) {
      addBtn.onclick = () => {
        if (window.CartSystem) {
          window.CartSystem.addItem(p.id, this.quantity);
          this.close();
        }
      };
    }
  },

  switchImage(src, btn) {
    const mainImg = document.getElementById('quickview-main-image');
    if (mainImg) mainImg.src = src;

    document.querySelectorAll('.thumbnail-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  },

  changeQty(delta) {
    this.quantity = Math.max(1, this.quantity + delta);
    const qtyVal = document.getElementById('quickview-qty-val');
    if (qtyVal) qtyVal.textContent = this.quantity;
  }
};

window.QuickViewSystem = QuickViewSystem;
