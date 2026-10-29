/**
 * SUCHE MOTI (سچے موتی) — INTERACTIVE LOOKBOOK
 * "Shop The Look" Pulsating Hotspots & Quick Buy Popovers
 */

const LookbookSystem = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Toggle hotspot cards
    document.querySelectorAll('.hotspot-pin').forEach(pin => {
      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        const node = pin.closest('.hotspot-node');
        const isActive = node.classList.contains('active');

        // Close all other hotspots
        document.querySelectorAll('.hotspot-node').forEach(n => n.classList.remove('active'));

        if (!isActive) {
          node.classList.add('active');
        }
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.hotspot-node')) {
        document.querySelectorAll('.hotspot-node').forEach(n => n.classList.remove('active'));
      }
    });

    // Add to bag from hotspot card
    document.querySelectorAll('.hotspot-add-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute('data-product-id');
        if (window.CartSystem) {
          window.CartSystem.addItem(id, 1);
        }
        document.querySelectorAll('.hotspot-node').forEach(n => n.classList.remove('active'));
      });
    });
  }
};

window.LookbookSystem = LookbookSystem;
