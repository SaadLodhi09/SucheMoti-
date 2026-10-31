/**
 * SUCHE MOTI — MAIN APPLICATION ENGINE
 * Pure Vanilla JavaScript (ES6+) Production Architecture
 */

// Global Currency State: 'PKR' or 'USD'
window.currentCurrency = 'PKR';

// Toast Notification Utility
window.showToast = function(message, isError = false) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  if (isError) {
    toast.style.borderLeftColor = 'var(--color-error)';
  }

  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${isError 
        ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>' 
        : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.35s ease';
    setTimeout(() => toast.remove(), 350);
  }, 3500);
};

// Main App Controller
const App = {
  currentCategory: 'all',
  currentSort: 'featured',
  searchQuery: '',

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this.highlightActiveNav();
    this.initHeaderScroll();
    this.initCurrencyToggle();
    this.initMobileMenu();
    this.initProductCatalog();
    this.initScrollReveals();
    this.initSearch();
    this.initCheckoutModal();
    this.initNewsletter();

    // Initialize sub-modules
    if (window.CartSystem) window.CartSystem.init();
    if (window.WishlistSystem) window.WishlistSystem.init();
    if (window.QuickViewSystem) window.QuickViewSystem.init();
    if (window.LookbookSystem) window.LookbookSystem.init();
  },

  // Highlight Current Active Page in Navigation
  highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const target = href.split('#')[0];
      if (target === currentPath || (currentPath === '' && target === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  },

  // 1. Header Blur on Scroll
  initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  },

  // 2. Currency Switcher Toggle
  initCurrencyToggle() {
    const handleToggle = () => {
      window.currentCurrency = (window.currentCurrency === 'PKR') ? 'USD' : 'PKR';
      const label = window.currentCurrency === 'PKR' ? 'PKR ₨' : 'USD $';
      
      const btn = document.getElementById('currency-toggle');
      if (btn) btn.textContent = label;

      const mobileBtn = document.getElementById('mobile-currency-btn');
      if (mobileBtn) mobileBtn.textContent = label;
      
      // Re-render catalog and cart
      this.renderProducts();
      if (window.CartSystem) window.CartSystem.render();
      if (window.QuickViewSystem && window.QuickViewSystem.currentProduct) {
        window.QuickViewSystem.render();
      }

      window.showToast(`Currency switched to ${window.currentCurrency}`);
    };

    const btn = document.getElementById('currency-toggle');
    if (btn) btn.addEventListener('click', handleToggle);

    const mobileBtn = document.getElementById('mobile-currency-btn');
    if (mobileBtn) mobileBtn.addEventListener('click', handleToggle);
  },

  // 2b. Mobile Navigation Drawer
  initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const backdrop = document.getElementById('mobile-nav-backdrop');
    const closeBtn = document.getElementById('mobile-nav-close');

    const openMenu = () => {
      if (drawer && backdrop) {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    const closeMenu = () => {
      if (drawer && backdrop) {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (backdrop) backdrop.addEventListener('click', closeMenu);

    // Close when clicking any link inside drawer
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });
  },

  // 3. Product Catalog Grid & Filters
  initProductCatalog() {
    // Read URL Search Parameters (e.g. ?type=rings or ?category=festive)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('type') || urlParams.get('category') || urlParams.get('cat');
    const sortParam = urlParams.get('sort');

    if (catParam) {
      this.currentCategory = catParam.toLowerCase();
    }

    // Category Filter Pills
    const pills = document.querySelectorAll('.filter-pill');
    if (pills.length > 0) {
      let matchedPill = false;
      pills.forEach(pill => {
        const cat = pill.getAttribute('data-category');
        if (cat === this.currentCategory) {
          pill.classList.add('active');
          matchedPill = true;
        } else {
          pill.classList.remove('active');
        }

        pill.addEventListener('click', (e) => {
          pills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          this.currentCategory = pill.getAttribute('data-category');
          this.renderProducts();
        });
      });

      // If URL param didn't match any pill, activate 'all' pill
      if (!matchedPill && this.currentCategory !== 'all') {
        const allPill = document.querySelector('.filter-pill[data-category="all"]');
        if (allPill && !catParam) allPill.classList.add('active');
      }
    }

    // Sorting Dropdown
    const sortSelect = document.getElementById('catalog-sort');
    if (sortSelect) {
      if (sortParam) {
        this.currentSort = sortParam;
        sortSelect.value = sortParam;
      }
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.renderProducts();
      });
    }

    // Direct Add-to-bag clicks from product cards
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.card-quick-add-btn');
      if (addBtn) {
        e.preventDefault();
        const id = addBtn.getAttribute('data-product-id');
        if (window.CartSystem) {
          window.CartSystem.addItem(id, 1);
        }
      }
    });

    // Initial render
    this.renderProducts();
  },

  renderProducts() {
    const grid = document.getElementById('products-grid');
    const counter = document.getElementById('catalog-count');
    if (!grid) return;

    let list = [...SUCHE_MOTI_PRODUCTS];

    // Filter by Category or itemType
    if (this.currentCategory !== 'all') {
      const c = this.currentCategory.toLowerCase();
      list = list.filter(p => 
        (p.category && p.category.toLowerCase() === c) || 
        (p.subCategory && p.subCategory.toLowerCase() === c) ||
        (p.itemType && p.itemType.toLowerCase() === c)
      );
    }

    // Filter by Search Query
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.pearlType.toLowerCase().includes(q)
      );
    }

    // Sort
    if (this.currentSort === 'price-low') {
      list.sort((a, b) => a.pricePKR - b.pricePKR);
    } else if (this.currentSort === 'price-high') {
      list.sort((a, b) => b.pricePKR - a.pricePKR);
    } else if (this.currentSort === 'new') {
      list.reverse();
    }

    if (counter) {
      counter.textContent = `Displaying ${list.length} Creations`;
    }

    const isUSD = (window.currentCurrency === 'USD');
    const exchangeRate = 278;

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--color-slate-400);">
          <p style="font-size: 1.25rem; font-family: var(--font-serif); margin-bottom: 0.5rem;">No Pieces Found in this Selection</p>
          <p style="font-size: 0.85rem;">Try selecting "All Creations" or reset your search filters.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(p => {
      const isSaved = window.WishlistSystem && window.WishlistSystem.has(p.id);
      const priceFormatted = isUSD 
        ? `$${Math.round(p.pricePKR / exchangeRate)}` 
        : `₨ ${p.pricePKR.toLocaleString()}`;

      return `
        <article class="product-card reveal-item" data-id="${p.id}">
          <div class="product-image-container luster-sheen-target">
            <span class="badge badge-gold product-card-badge">${p.badge}</span>
            <button type="button" class="card-wishlist-btn ${isSaved ? 'active' : ''}" data-product-id="${p.id}" aria-label="Save to Wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <img src="${p.primaryImg}" alt="${p.title}" class="img-primary" loading="lazy">
            <img src="${p.hoverImg}" alt="${p.title} detail angle" class="img-hover" loading="lazy">
            
            <div class="card-actions-bar">
              <button type="button" class="card-quick-add-btn" data-product-id="${p.id}">Add to Bag</button>
              <button type="button" class="card-quickview-btn" data-product-id="${p.id}" aria-label="Quick View">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="product-info">
            <h3 class="product-title" onclick="QuickViewSystem.open('${p.id}')" style="cursor: pointer;">${p.title}</h3>
            <div class="product-price-box">
              <span class="product-price">${priceFormatted}</span>
            </div>
            <div class="product-stars-row">
              <span class="stars-gold">★★★★★</span>
              <span class="reviews-count">(${p.reviewsCount})</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Trigger scroll reveal animations for new items
    this.initScrollReveals();
  },

  // 4. Scroll Reveal via IntersectionObserver
  initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });

    document.querySelectorAll('.reveal-item:not(.is-revealed)').forEach((el, index) => {
      el.style.setProperty('--reveal-delay', `${(index % 4) * 100}ms`);
      observer.observe(el);
    });
  },

  // 5. Search Overlay
  initSearch() {
    const searchTrigger = document.getElementById('search-trigger');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const searchClose = document.getElementById('search-close');

    if (searchTrigger && searchModal && searchInput) {
      searchTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        searchModal.classList.add('active');
        searchInput.focus();
        document.body.style.overflow = 'hidden';
      });

      if (searchClose) {
        searchClose.addEventListener('click', () => {
          searchModal.classList.remove('active');
          document.body.style.overflow = '';
        });
      }

      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderProducts();
      });
    }
  },

  // 6. Simulated Checkout Modal (COD, Bank Transfer / Raast, Card)
  initCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutClose = document.getElementById('checkout-close');
    const checkoutForm = document.getElementById('checkout-form');

    window.openCheckoutModal = () => {
      if (checkoutModal) {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };

    if (checkoutClose && checkoutModal) {
      checkoutClose.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('checkout-name').value;
        const city = document.getElementById('checkout-city').value;
        const method = document.querySelector('input[name="payment_method"]:checked')?.value || 'COD';

        // Order Success Simulation
        if (checkoutModal) checkoutModal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear Cart
        if (window.CartSystem) {
          window.CartSystem.items = [];
          window.CartSystem.saveToStorage();
          window.CartSystem.render();
        }

        const successModal = document.getElementById('order-success-modal');
        if (successModal) {
          document.getElementById('success-client-name').textContent = name;
          document.getElementById('success-order-city').textContent = city;
          document.getElementById('success-payment-type').textContent = method.toUpperCase();
          successModal.classList.add('active');
        }

        window.showToast(`Order Placed Successfully for ${name}!`);
      });
    }
  },

  // 7. VIP Newsletter Subscription
  initNewsletter() {
    const form = document.getElementById('community-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (input && input.value) {
          window.showToast('Thank you for joining our community!');
          input.value = '';
        }
      });
    }
  }
};

// Launch Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

window.App = App;
