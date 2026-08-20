/* ── Thumbnail Gallery ── */
function initGallery() {
  const mainImg = document.getElementById('main-img');
  const thumbs  = document.querySelectorAll('.thumbnail');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      mainImg.src = thumb.dataset.full;
      mainImg.alt = thumb.querySelector('img').alt;
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

/* ── Variant selection ── */
function initVariants() {
  document.querySelectorAll('.variant-options').forEach(group => {
    group.querySelectorAll('.variant-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  });
}

/* ── Cart notification ── */
function initCart() {
  const countEl = document.getElementById('cart-count');
  let count = 0;

  function bump() {
    count++;
    countEl.textContent = count;
    countEl.style.transform = 'scale(1.4)';
    setTimeout(() => countEl.style.transform = 'scale(1)', 200);
  }

  const addBtn = document.getElementById('btn-add-cart');
  const buyBtn = document.getElementById('btn-buy-now');

  if (addBtn) addBtn.addEventListener('click', () => {
    bump();
    showToast('Added to Cart');
  });

  if (buyBtn) buyBtn.addEventListener('click', () => {
    bump();
    showToast('Proceeding to checkout…');
  });
}

/* ── Toast ── */
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    Object.assign(toast.style, {
      position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
      background: '#232f3e', color: '#fff', padding: '12px 24px', borderRadius: '6px',
      fontSize: '14px', fontFamily: 'Arial,sans-serif', zIndex: 9999,
      transition: 'opacity .3s', opacity: '0', pointerEvents: 'none',
    });
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.style.opacity = '0', 2000);
}

/* ── Language selector (mock) ── */
function initLang() {
  const langBtn = document.getElementById('lang-btn');
  if (!langBtn) return;
  langBtn.addEventListener('click', () => showToast('Language: English (US)'));
}

/* ── Back to top ── */
function initFooterTop() {
  const el = document.getElementById('footer-top');
  if (el) el.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Related Products ── */
function initRelatedProducts(relatedProducts) {
  const section = document.getElementById('related-products-section');
  const grid = document.getElementById('related-products-grid');

  if (!relatedProducts || relatedProducts.length === 0) {
    section.style.display = 'none';
    return;
  }

  // Show section and limit to max 6 items
  section.style.display = 'block';
  const items = relatedProducts.slice(0, 6);

  // Get base URL (protocol + host)
  const baseURL = `${window.location.protocol}//${window.location.host}`;

  // Default image URL if not provided or empty
  const defaultImageURL = 'https://www.sobres.es/cdn/shop/files/BOX155_02.jpg?v=1761919871&width=1500';

  // Render each product
  grid.innerHTML = items.map(product => {
    const productId = product.relatedProductId || '';
    const productName = product.relatedProductName || 'Product';
    const productPrice = product.relatedProductPrice || 100;
    const imageURL = (product.relatedProductImageURL && product.relatedProductImageURL.trim() !== '')
      ? product.relatedProductImageURL
      : defaultImageURL;

    // Calculate prices
    const currentPrice = Number(productPrice);
    const listPrice = currentPrice * 1.2;
    const savings = listPrice - currentPrice;
    const savingsPercent = Math.round((savings / listPrice) * 100);

    // Format prices
    const currentPriceFormatted = `$${currentPrice.toFixed(2)}`;
    const listPriceFormatted = `$${listPrice.toFixed(2)}`;
    const savingsFormatted = `$${savings.toFixed(2)}`;

    // Build product link
    const productLink = `${baseURL}/${productId}`;

    // Generate random rating between 3 and 5
    const rating = Math.floor(Math.random() * 3) + 3;
    const stars = '&#9733;'.repeat(rating) + '&#9734;'.repeat(5 - rating);

    return `
      <div class="related-product-card">
        <img src="${imageURL}" alt="${productName}" class="related-product-image">
        <a href="${productLink}" class="related-product-name">${productName}</a>
        <div class="related-product-stars">${stars}</div>
        <div class="related-product-price">${currentPriceFormatted}</div>
        <div class="related-product-list-price">List: <s>${listPriceFormatted}</s></div>
        <div class="related-product-save">You Save: ${savingsFormatted} (${savingsPercent}%)</div>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initVariants();
  initCart();
  initLang();
  initFooterTop();

  // Initialize related products from server data (window.RELATED_PRODUCTS)
  const relatedProductsData = window.RELATED_PRODUCTS || [];
  initRelatedProducts(relatedProductsData);
});
