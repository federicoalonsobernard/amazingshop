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

document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initVariants();
  initCart();
  initLang();
  initFooterTop();
});
