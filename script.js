'use strict';

const menuItems = [
  { name: 'Veg Farmhouse Pizza', price: 129, category: 'pizzas', popular: true, note: 'Colourful veggies, plenty of comfort.' },
  { name: 'BBQ Chicken Pizza', price: 149, category: 'pizzas', popular: true, note: 'A smoky, savoury favourite.' },
  { name: 'Farmhouse Pizza', price: 129, category: 'pizzas' },
  { name: 'Corn & Cheese Pizza', price: 129, category: 'pizzas' },
  { name: 'Roasted Chicken Pizza', price: 149, category: 'pizzas' },
  { name: 'Add on Cheese', price: 15, category: 'pizzas', note: 'Extra cheesy goodness.' },
  { name: 'Veg Coleslaw Sandwich', price: 59, category: 'sandwiches' },
  { name: 'Chicken Coleslaw Sandwich', price: 99, category: 'sandwiches' },
  { name: 'Creamy Corn Cheese Sandwich', price: 89, category: 'sandwiches', popular: true, note: 'Creamy, toasted comfort food.' },
  { name: 'Paneer Sandwich', price: 99, category: 'sandwiches' },
  { name: 'Creamy Chicken Sandwich', price: 129, category: 'sandwiches' },
  { name: 'BBQ Chicken Sandwich', price: 139, category: 'sandwiches', popular: true, note: 'Smoky, saucy sandwich-time.' },
  { name: 'French Fries', price: 59, category: 'quick-bites' },
  { name: 'Peri Peri Fries', price: 69, category: 'quick-bites', popular: true },
  { name: 'Veg Popcorn', price: 79, category: 'quick-bites' },
  { name: 'Garlic Bread', price: 69, category: 'quick-bites' },
  { name: 'Cheese Garlic Bread', price: 79, category: 'quick-bites' },
  { name: 'Chicken Nuggets', price: 129, category: 'quick-bites' },
  { name: 'Chicken Popcorn', price: 129, category: 'quick-bites' },
  { name: 'Ultimate Veg Burger', price: 129, category: 'burgers' },
  { name: 'Heavenly Chicken Burger', price: 149, category: 'burgers' },
  { name: 'Add on Cheese', price: 15, category: 'burgers', note: 'Add extra cheese to your burger.' },
  { name: 'Veg Sandwich + Fries', price: 99, category: 'combos' },
  { name: 'Chicken Sandwich + Fries', price: 129, category: 'combos' },
  { name: 'Veg Pizza + Coke', price: 139, category: 'combos' },
  { name: 'Chicken Pizza + Coke', price: 159, category: 'combos' },
  { name: 'Veg Burger + Fries + Lime Juice', price: 199, category: 'combos' },
  { name: 'Chicken Burger + Fries + Lime Juice', price: 219, category: 'combos' },
  { name: 'Bun Maska', price: 39, category: 'bakery', popular: true },
  { name: 'Bun GulKand', price: 49, category: 'bakery' },
  { name: 'Add on Butter', price: 10, category: 'bakery' },
  { name: 'Plain Maggi', price: 49, category: 'maggi' },
  { name: 'Veg Maggi', price: 59, category: 'maggi' },
  { name: 'Egg Maggi', price: 69, category: 'maggi' },
  { name: 'Chicken Maggi', price: 99, category: 'maggi' },
  { name: 'Add on Cheese', price: 15, category: 'maggi' },
  { name: 'Oreo Shake', price: 99, category: 'sips', popular: true }
];

const menuGrid = document.querySelector('#menu-grid');
const menuSearch = document.querySelector('#menu-search');
const menuTabs = Array.from(document.querySelectorAll('.menu-tab'));
let activeFilter = 'popular';

function renderMenu() {
  if (!menuGrid) return;
  const query = (menuSearch?.value || '').trim().toLowerCase();
  const filtered = menuItems.filter((item) => {
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'popular' ? item.popular : item.category === activeFilter);
    const matchesSearch = !query || `${item.name} ${item.category} ${item.note || ''}`.toLowerCase().includes(query);
    return matchesFilter && matchesSearch;
  });

  if (!filtered.length) {
    menuGrid.innerHTML = '<p class="menu-empty">No menu matches that search just yet. Try another craving or browse the full menu.</p>';
    return;
  }
  menuGrid.innerHTML = filtered.map((item) => `
    <article class="menu-item">
      <div class="menu-item__head"><h3>${escapeHTML(item.name)}</h3><span class="menu-item__price">₹${item.price}</span></div>
      ${item.note ? `<p>${escapeHTML(item.note)}</p>` : ''}
      ${item.popular ? '<span class="menu-item__badge">Kathe favourite ✳</span>' : ''}
    </article>`).join('');
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}

menuTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activeFilter = tab.dataset.filter || 'all';
    menuTabs.forEach((button) => {
      const selected = button === tab;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    renderMenu();
  });
});
menuSearch?.addEventListener('input', renderMenu);
renderMenu();

// Compact, accessible mobile navigation.
const navToggle = document.querySelector('.nav-toggle');
const primaryNav = document.querySelector('#primary-nav');
function closeNav() {
  navToggle?.setAttribute('aria-expanded', 'false');
  navToggle?.setAttribute('aria-label', 'Open navigation menu');
  primaryNav?.classList.remove('is-open');
  document.body.classList.remove('nav-open');
}
navToggle?.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') !== 'true';
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  primaryNav?.classList.toggle('is-open', open);
  document.body.classList.toggle('nav-open', open);
});
primaryNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeNav(); });
window.addEventListener('resize', () => { if (window.innerWidth > 700) closeNav(); });

// Fade content in gently as it enters view; still works without IntersectionObserver.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Keyboard-friendly photo lightbox for gallery images.
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxCaption = document.querySelector('#lightbox-caption');
const lightboxClose = document.querySelector('.lightbox__close');
document.querySelectorAll('.gallery-item').forEach((button) => {
  button.addEventListener('click', () => {
    const imagePath = button.dataset.image;
    if (!imagePath || !lightbox || !lightboxImage) return;
    lightboxImage.src = imagePath;
    lightboxImage.alt = button.dataset.alt || '';
    if (lightboxCaption) lightboxCaption.textContent = button.dataset.alt || '';
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else window.open(imagePath, '_blank', 'noopener');
  });
});
lightboxClose?.addEventListener('click', () => lightbox?.close());
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox?.addEventListener('close', () => {
  if (lightboxImage) lightboxImage.src = '';
});

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());
