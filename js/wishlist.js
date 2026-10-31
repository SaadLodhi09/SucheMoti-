/**
 * SUCHE MOTI (سچے موتی) — WISHLIST SYSTEM
 * Handles Wishlist persistence, animated heart states, & badge counters
 */

const WishlistSystem = {
  items: [],

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.updateUI();
  },

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('suche_moti_wishlist');
      if (saved) {
        this.items = JSON.parse(saved);
      }
    } catch (e) {
      this.items = [];
    }
  },

  saveToStorage() {
    try {
      localStorage.setItem('suche_moti_wishlist', JSON.stringify(this.items));
    } catch (e) {
      console.error('Error saving wishlist:', e);
    }
  },

  toggle(productId) {
    const index = this.items.indexOf(productId);
    const product = SUCHE_MOTI_PRODUCTS.find(p => p.id === productId);

    if (index > -1) {
      this.items.splice(index, 1);
      if (window.showToast && product) {
        window.showToast(`Removed "${product.title}" from Wishlist`);
      }
    } else {
      this.items.push(productId);
      if (window.showToast && product) {
        window.showToast(`Saved "${product.title}" to Wishlist ✨`);
      }
    }

    this.saveToStorage();
    this.updateUI();
  },

  has(productId) {
    return this.items.includes(productId);
  },

  updateUI() {
    // Update header badge
    const count = this.items.length;
    document.querySelectorAll('.wishlist-badge-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });

    // Update heart icons on cards
    document.querySelectorAll('.card-wishlist-btn').forEach(btn => {
      const id = btn.getAttribute('data-product-id');
      if (this.has(id)) {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Remove from Wishlist');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Add to Wishlist');
      }
    });
  },

  bindEvents() {
    // Header Wishlist Icon Click
    const navBtn = document.getElementById('wishlist-nav-btn');
    if (navBtn) {
      navBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const count = this.items.length;
        if (count === 0) {
          window.showToast('Your Wishlist is currently empty. Tap the heart on any piece to save it.');
        } else {
          window.showToast(`You have ${count} piece${count > 1 ? 's' : ''} saved in your Wishlist.`);
          const grid = document.getElementById('products-grid');
          if (grid) {
            grid.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = 'new-in.html';
          }
        }
      });
    }

    // Event delegation on document for wishlist buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.card-wishlist-btn');
      if (btn) {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-product-id');
        btn.classList.add('heart-pop');
        setTimeout(() => btn.classList.remove('heart-pop'), 400);
        this.toggle(id);
      }
    });
  }
};

window.WishlistSystem = WishlistSystem;
