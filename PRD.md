# PRD: Suche Moti (سچے موتی) — High-End Pearl Jewelry E-Commerce Frontend

## 1. Project Overview & Verified Company Profile
- **Project Name:** Suche Moti (سچے موتی) — Premium Jewelry Boutique
- **Official Slogan:** *"Timeless Elegance, Purely Yours."*
- **Origin & Base:** Okara, Punjab, Pakistan (Sourced from artisan guilds in Lahore, Karachi & Okara).
- **Founding Team:** Saad Lodhi (Operations & Logistics), Muqaddas Hanif (Marketing & Social), Dua Safdar (Customer Experience).
- **Academic Context:** University Web Engineering Capstone Project.
- **Core Technology Stack:** Semantic HTML5, Modern Vanilla CSS3, Clean Modular Vanilla JavaScript (ES6+).
- **Architecture Philosophy:** Zero external framework bloat, 100% explainable code for university viva/presentation, high-performance modular design.
- **Brand Story & Inspiration:** 
  - Based on authentic business report for `@suche.moti1` ("Suche Moti" = Pure Pearls).
  - Editorial design language inspired by **Lumière Fine Jewelry (User Reference Img 2)**, **Zara**, and **Louis Vuitton**, blended with high-performance micro-interactions.
  - Avoiding generic "vibe-coded" AI templates; prioritizing high-taste editorial whitespace, bespoke typography, arched frames, and tactile spring physics.

---

## 2. Design System & Aesthetics (TasteSkill & UI/UX Pro Standards)
- **Color Palette:**
  - *Obsidian Night (Primary Dark):* `#0c0d0e` / `#141618`
  - *Lustrous Pearl White (Primary Light):* `#fdfbf7`
  - *Oyster Iridescent Shimmer:* `#f4efe6` / `#eae3d2`
  - *Vintage Champagne Gold (Accent):* `#c5a059` / `#d4af37`
  - *Muted Slate Gray (Subtle Text/Borders):* `#828282` / `rgba(212, 175, 55, 0.2)`
- **Typography:**
  - *Headings & Editorial Titles:* `Cormorant Garamond` & `Playfair Display` (Luxury serif, high contrast, bespoke character).
  - *UI, Navigation & Technical Specs:* `Plus Jakarta Sans` / `Inter` (Geometric, clean, modern grotesque readability).
  - *Brand Accent:* Delicate Urdu Nastaliq calligraphy accents (`سچے موتی`).
- **Motion & Micro-Interactions (Framer Motion Emulated in Vanilla CSS/JS):**
  - Custom cubic-bezier timing curves (`cubic-bezier(0.16, 1, 0.3, 1)` and `cubic-bezier(0.25, 1, 0.5, 1)`).
  - Luster sheen reflection on card hover.
  - Staggered entrance animations on scroll using `IntersectionObserver`.
  - Magnetic button hover micro-interactions.
  - Smooth slide-out cart drawer with backdrop blur (`backdrop-filter: blur(16px)`).

---

## 3. Site Architecture & Feature Specifications

### 3.1 Header & Multi-Page Navigation
- Top announcement banner with express delivery notice (Free nationwide express delivery over PKR 3,000, 100% Certified Pearl Purity).
- Sticky minimal navbar with centered official Suche Moti logo, desktop links, and mobile slide-out drawer.
- **Multi-Page Site Structure (Dedicated Webpages):**
  1. `Home` (`index.html`) — Brand hero, guarantees, "Shop By Category" showcase, curated highlights, testimonials, purity standard.
  2. `New In` (`new-in.html`) — Storefront catalog for latest arrivals and bestsellers with live filtering and sorting.
  3. `Categories` (`categories.html`) — Dedicated category browser (Rings, Necklaces & Chokers, Earrings, Bracelets & Kadas, Men's Vault).
  4. `Collections` (`collections.html`) — Dedicated page for the 4 official collections (Festive Wear, Daily Essentials, Men's Collection, Pearl Specialties).
  5. `Lookbook` (`lookbook.html`) — Interactive "Shop The Look" editorial gallery with pulsating hotspots and popovers.
  6. `About` (`about.html`) — Heritage atelier story (Okara, Lahore, Karachi), master craftsmanship, 3 packaging tiers, and founders.
- Right utility bar: Live search toggle, Currency switcher (PKR ₨ / USD $), Wishlist counter, Slide-out Cart Drawer with localStorage synchronization across all pages.

### 3.2 Hero Section (Haute Couture Editorial)
- Asymmetrical split layout with high-impact pearl jewelry imagery and kinetic typography.
- Dual calls to action: "Explore The Royal Collection" & "The Bridal Trunk Show".
- Authentic verification stamp: "100% Certified Genuine Pearls • Handcrafted in Pakistan".

### 3.3 Curated Collections (Zara/LV Asymmetric Grid)
- High-contrast editorial cards with micro-hover zoom and collection narratives:
  1. *The Nizam Choker Suite* (Heritage royal pearl chokers)
  2. *Baroque & Keshi Modern* (Asymmetric organic pearls for contemporary styling)
  3. *Lustrous Drops & Jhumkas* (Classic earrings & ear studs)
  4. *The Heirlooms (Bridal)* (Multi-strand statement necklaces)
  5. *Solitaire & Pearl Rings* (Minimalist luxury bands)

### 3.4 Product Catalog & Interactive Storefront
- Dynamic category filter tabs (All, Necklaces, Earrings, Rings, Bridal, Baroque).
- Sort options: Featured, Price (Low to High), Price (High to Low), Newest Arrivals.
- Interactive Product Cards:
  - Dual-angle hover crossfade (model shot to jewelry close-up).
  - Pearl origin & grading badge (e.g., "Grade AAA Freshwater", "South Sea Baroque").
  - Instant "Quick View" action.
  - "Add to Bag" direct button.
  - Heart Wishlist toggle with animated burst.

### 3.5 Interactive Features & Utility Modules
- **Slide-out Luxury Cart Drawer:**
  - Real-time cart calculations (Subtotal, nationwide shipping, total).
  - Free shipping progress bar (e.g., "Add PKR 2,500 more for Complimentary Express Shipping").
  - Item quantity controls, remove item, promo code input simulator.
  - Simulated Checkout Modal (COD - Cash on Delivery, Bank Transfer, Visa/Mastercard).
- **Interactive Quick-View Modal:**
  - Multi-image gallery with thumbnail switcher.
  - Pearl specification table (Origin, Pearl Diameter, Metal Finishing, Clasp type).
  - Add to bag & Wishlist from modal.
- **Interactive Lookbook ("Shop the Look"):**
  - Full-bleed editorial lifestyle photograph with interactive pulsating hotspot pins.
  - Clicking a pin opens a mini product popover with instant "Add to Bag".
- **The Pearl Purity Guide & Educational Showcase:**
  - 4 Pillars of Pearl Quality: Luster, Nacre, Surface, Shape.
  - Clear, interactive educational tab/accordion demonstrating authentic vs fake pearl testing.
- **Client Stories & Social Proof (@suche.moti1 feed):**
  - Customer review carousel from major Pakistani cities (Lahore, Karachi, Islamabad).
  - Visual Instagram gallery feed mockup linking to `@suche.moti1`.
- **Global Footer:**
  - Newsletter VIP club signup with instant toast validation.
  - Customer care links, WhatsApp Concierge launcher, return policy.
  - Academic disclaimer: University Web Engineering Project portfolio showcase.

---

## 4. Ralph Loop Task Checklist

### Phase 1: Planning & Content Architecture [CURRENT PHASE]
- [x] Analyze requirements, user goals, and brand identity (@suche.moti1).
- [x] Formulate comprehensive Content Plan & Architecture blueprint.
- [x] Initialize `PRD.md` and `progress.txt` state files.
- [ ] Present Content Plan to user for approval and feedback.

### Phase 2: Design Tokens & Base Architecture
- [x] Set up clean directory structure (`css/`, `js/`, `assets/images/`, `assets/icons/`).
- [x] Create `css/variables.css` (Luxury color tokens, font imports, fluid spacing, elevation).
- [x] Create `css/base.css` (Modern CSS reset, smooth scrolling, typography scale).
- [x] Create `css/animations.css` (Framer Motion spring physics, shimmer, entrance staggers).

### Phase 3: Data & Component Foundation
- [x] Create `js/products-data.js` with comprehensive product catalog (PKR pricing, real pearl descriptions, high-resolution luxury imagery, specs).
- [x] Build global navigation & announcement bar with responsive mobile menu.
- [x] Build hero editorial section with kinetic typography and dual CTA.

### Phase 4: Product Catalog & Interactive Storefront
- [x] Implement filterable product grid with category pills and sort controls.
- [x] Implement product cards with dual-image hover crossfade and luxury badges.
- [x] Build Interactive Quick-View modal with image gallery and pearl specifications.

### Phase 5: High-End Interactive Features
- [x] Implement Slide-Out Cart Drawer (`js/cart.js`) with LocalStorage persistence and free shipping meter.
- [x] Implement Wishlist system (`js/wishlist.js`) with animated hearts and local persistence.
- [x] Implement Interactive Lookbook ("Shop the Look") with clickable pulsating hotspots (`js/lookbook.js`).
- [x] Implement Currency Switcher (PKR ₨ / USD $) with live price recalculation.
- [x] Implement Educational Pearl Quality Guide & Interactive Authenticity Test.

### Phase 6: Social Proof, Footer & Polish
- [x] Build Instagram showcase section referencing `@suche.moti1`.
- [x] Build client reviews carousel and WhatsApp concierge launcher.
- [x] Build luxury footer with newsletter VIP signup and university project credits.
- [x] Implement responsive mobile navigation drawer and touch optimizations.

### Phase 7: Verification & CodeRabbit Review
- [x] Cross-browser validation, responsive layout check (desktop, tablet, mobile).
- [x] CodeRabbit review: semantic markup, clean variable naming, zero console errors, modular code clarity for university viva.
