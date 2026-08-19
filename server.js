'use strict';
const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app      = express();
const PORT     = 5501;
const ROOT     = __dirname;
const ITEMS    = path.join(ROOT, 'items');

if (!fs.existsSync(ITEMS)) fs.mkdirSync(ITEMS, { recursive: true });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(ROOT));

/* ── Utilities ─────────────────────────────────────────────────── */

function h(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CURRENCY_SYMBOLS = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', CAD: 'CA$', AUD: 'A$' };

function formatPrice(amount, currencyCode) {
  const sym = CURRENCY_SYMBOLS[currencyCode] || (currencyCode ? currencyCode + ' ' : '$');
  const [whole, frac] = Number(amount).toFixed(2).split('.');
  const wholeFormatted = Number(whole).toLocaleString('en-US');
  return { sym, whole: wholeFormatted, frac };
}

function getEnglish(arr, textKey, langKey) {
  if (!Array.isArray(arr)) return null;
  const match = arr.find(x => x?.[langKey]?.Code === 'en');
  return match?.[textKey] || null;
}

function getEnglishItems(arr, textKey, langKey) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(x => x?.[langKey]?.Code === 'en').map(x => x[textKey]).filter(Boolean);
}


/* ── Shared header ─────────────────────────────────────────────── */

function renderHeader() {
  return `
<header id="header">
  <div id="header-main">
    <a href="/" class="header-logo">
      <img src="/assets/amazinglogo.jpg" alt="Amazing.com">
    </a>
    <div class="header-deliver">
      <span>Deliver to</span>
      <span>United States</span>
    </div>
    <div class="header-search">
      <select class="search-category" aria-label="Search category">
        <option>All</option><option>Electronics</option><option>Clothing</option>
        <option>Books</option><option>Home &amp; Garden</option><option>Sports</option>
      </select>
      <input class="search-input" type="text" placeholder="Search Amazing.com" aria-label="Search">
      <button class="search-btn" aria-label="Search">&#128269;</button>
    </div>
    <div id="lang-btn" class="header-lang">
      <img src="https://flagcdn.com/w20/us.png" alt="US flag">
      <span>EN</span><span>&#9660;</span>
    </div>
    <div class="header-account">
      <span>Hello, sign in</span>
      <span>Account &amp; Lists &#9660;</span>
    </div>
    <div class="header-returns">
      <span>Returns</span><span>&amp; Orders</span>
    </div>
    <a href="#" class="header-cart">
      <div class="cart-icon" style="position:relative;font-size:30px;">
        &#128722;<span id="cart-count" class="cart-count">0</span>
      </div>
      <span class="cart-label">Cart</span>
    </a>
  </div>
  <nav id="header-nav">
    <a href="#" class="nav-link nav-link-all">&#9776; All</a>
    <a href="#" class="nav-link">Today's Deals</a>
    <a href="#" class="nav-link">Customer Service</a>
    <a href="#" class="nav-link">Registry</a>
    <a href="#" class="nav-link">Gift Cards</a>
    <a href="#" class="nav-link">Electronics</a>
    <a href="#" class="nav-link">Books</a>
    <a href="#" class="nav-link">Home &amp; Garden</a>
    <a href="#" class="nav-link">Sports &amp; Outdoors</a>
    <a href="#" class="nav-link">Clothing</a>
    <a href="#" class="nav-link">Sell</a>
  </nav>
</header>`;
}

/* ── Shared footer ─────────────────────────────────────────────── */

function renderFooter() {
  return `
<footer>
  <div id="footer-top">Back to top</div>
  <div id="footer-links">
    <div class="footer-col"><h4>Get to Know Us</h4><ul>
      <li><a href="#">Careers</a></li><li><a href="#">Blog</a></li>
      <li><a href="#">About Amazing</a></li><li><a href="#">Investor Relations</a></li>
    </ul></div>
    <div class="footer-col"><h4>Make Money with Us</h4><ul>
      <li><a href="#">Sell on Amazing</a></li><li><a href="#">Become an Affiliate</a></li>
      <li><a href="#">Advertise Your Products</a></li>
    </ul></div>
    <div class="footer-col"><h4>Amazing Payment Products</h4><ul>
      <li><a href="#">Amazing Business Card</a></li><li><a href="#">Shop with Points</a></li>
      <li><a href="#">Reload Your Balance</a></li>
    </ul></div>
    <div class="footer-col"><h4>Let Us Help You</h4><ul>
      <li><a href="#">Your Account</a></li><li><a href="#">Your Orders</a></li>
      <li><a href="#">Shipping Rates &amp; Policies</a></li><li><a href="#">Help</a></li>
    </ul></div>
  </div>
  <div id="footer-bottom">
    <a href="/"><img src="/assets/amazinglogo.jpg" alt="Amazing.com"
      style="height:28px;display:inline-block;vertical-align:middle;filter:brightness(0) invert(1);margin-bottom:8px;"></a><br>
    <a href="#">Conditions of Use</a> <a href="#">Privacy Notice</a>
    <a href="#">Consumer Disclosure</a><br>
    &copy; 2025, Amazing.com, Inc. or its affiliates. All rights reserved.
  </div>
</footer>`;
}


/* ── Image gallery ─────────────────────────────────────────────── */

function renderGallery(d) {
  const medias    = Array.isArray(d.medias) ? d.medias : [];
  const mainImage = medias[0]?.image_url || d.main_image_url || d.front_image_url || d.image_url || '';
  if (!mainImage) return '';

  const thumbsHtml = medias.length > 1
    ? medias.map((m, i) => `
      <div class="thumbnail${i === 0 ? ' active' : ''}" data-full="${h(m.image_url)}">
        <img src="${h(m.image_url)}" alt="${h(m.image_name || 'View ' + (i+1))}"
          onerror="this.src='https://placehold.co/54x54/eeeeee/555555?text=${i+1}'">
      </div>`).join('')
    : '';

  return `
  <div id="image-column">
    ${thumbsHtml ? `<div class="thumbnail-list">${thumbsHtml}</div>` : ''}
    <div class="main-image-wrap">
      <img id="main-img" src="${h(mainImage)}" alt="Product image"
        onerror="this.src='https://placehold.co/600x600/eeeeee/555555?text=No+Image'">
    </div>
  </div>`;
}

/* ── Price block ───────────────────────────────────────────────── */

function renderPriceBlock(d) {
  const sp = d.sellingPrice;
  if (!sp || sp.sellingPriceAmount == null) return '';
  const { sym, whole, frac } = formatPrice(sp.sellingPriceAmount, sp.sellingCurrency?.Code);
  const label = sp.sellingPriceType?.Name || 'Price';
  return `
    <div class="price-block">
      <span class="price-label">${h(label)}:</span>
      <div class="price-current">
        <span class="price-symbol">${h(sym)}</span>
        <span class="price-whole">${h(whole)}</span>
        <span class="price-fraction">.${h(frac)}</span>
      </div>
    </div>
    <hr class="divider">`;
}

/* ── Info column ───────────────────────────────────────────────── */

function renderInfoColumn(productId, d, productContent) {
  const enDesc      = (d.description || []).find(x => x?.descriptionLanguage?.Code === 'en') || {};
  const title       = enDesc.productTitle || d.identifier || productId;
  const shortDesc   = enDesc.shortDescription || '';
  const longDesc    = enDesc.longDescription  || (typeof d.long_description === 'string' ? d.long_description : '') || '';
  const brand       = d.brand || '';

  const highlights  = getEnglishItems(d.productHighlights, 'productHighlight', 'producthighlightsLanguage');
  const keywords    = getEnglishItems(d.keywords, 'keyword', 'keywordsLanguage');
  const tags        = getEnglishItems(d.tags, 'tag', 'tagsLanguage');
  const extInfo     = Array.isArray(d.extended_product_information) ? d.extended_product_information : [];
  const benefits    = (d.print_specific_attributes || []).filter(a => a.key?.startsWith('benefit'));

  const identifierRow = [
    d.identifier ? `<dt>Item ID</dt><dd>${h(d.identifier)}</dd>` : '',
    d.gtin       ? `<dt>GTIN</dt><dd>${h(d.gtin)}</dd>`          : '',
    d.countryOfOrigin?.Name ? `<dt>Country of Origin</dt><dd>${h(d.countryOfOrigin.Name)}</dd>` : '',
    d.manufacturer && d.manufacturer !== d.brand ? `<dt>Manufacturer</dt><dd>${h(d.manufacturer)}</dd>` : '',
  ].filter(Boolean).join('');

  return `
  <div id="info-column">
    <h1 class="product-title">${h(title)}</h1>
    ${brand ? `<p class="product-brand">Brand: <a href="#">${h(brand)}</a></p>` : ''}
    ${shortDesc ? `<p class="product-short-desc">${h(shortDesc)}</p>` : ''}
    <hr class="divider">
    ${renderPriceBlock(d)}

    ${highlights.length ? `
    <div class="section-block">
      <h3 class="section-title">Highlights</h3>
      <ul class="highlights-list">
        ${highlights.map(t => `<li>${h(t)}</li>`).join('')}
      </ul>
    </div>` : ''}

    ${productContent ? `
    <div class="section-block description-section">
      <h3>About this item</h3>
      ${productContent}
    </div>` : ''}

    ${longDesc ? `
    <div class="section-block">
      <p>${h(longDesc)}</p>
    </div>` : ''}

    ${benefits.length ? `
    <div class="section-block">
      <h3 class="section-title">Key Benefits</h3>
      <ul class="benefits-list">
        ${benefits.map(b => `<li><strong>${h(b.label)}:</strong> ${h(b.value)}</li>`).join('')}
      </ul>
    </div>` : ''}

    ${extInfo.length ? `
    <div class="section-block">
      <h3 class="section-title">Product Specifications</h3>
      <table class="specs-table">
        <tbody>
          ${extInfo.map(r => `<tr><th>${h(r.attribute_name)}</th><td>${h(r.attribute_value)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>` : ''}

    ${identifierRow ? `
    <div class="section-block">
      <h3 class="section-title">Product Details</h3>
      <dl class="product-meta-table">${identifierRow}</dl>
    </div>` : ''}

    ${d.brochure_url ? `
    <div class="section-block">
      <a href="${h(d.brochure_url)}" class="brochure-link" target="_blank" rel="noopener">
        &#8659; Download Product Brochure (PDF)
      </a>
    </div>` : ''}

    ${keywords.length ? `
    <div class="section-block">
      <h3 class="section-title">Keywords</h3>
      <div class="chips-row">
        ${keywords.map(k => `<span class="chip">${h(k)}</span>`).join('')}
      </div>
    </div>` : ''}

    ${tags.length ? `
    <div class="section-block">
      <div class="chips-row">
        ${tags.map(t => `<span class="chip chip-tag">${h(t)}</span>`).join('')}
      </div>
    </div>` : ''}
  </div>`;
}


/* ── Buy box ───────────────────────────────────────────────────── */

function renderBuyBox(d) {
  const sp = d.sellingPrice;
  const priceHtml = sp && sp.sellingPriceAmount != null ? (() => {
    const { sym, whole, frac } = formatPrice(sp.sellingPriceAmount, sp.sellingCurrency?.Code);
    return `<div class="buy-price"><span class="p-sym">${h(sym)}</span><span class="p-int">${h(whole)}</span><span class="p-dec">.${h(frac)}</span></div>`;
  })() : '';

  const manufacturer = d.manufacturer || d.brand || 'Amazing Seller';

  return `
  <aside id="buy-column">
    <div class="buy-box">
      ${priceHtml}
      <p class="buy-shipping">FREE delivery <span style="font-weight:700;">Tomorrow</span></p>
      <p class="buy-stock">In Stock</p>
      <div class="buy-qty">
        <label for="qty-select">Qty:</label>
        <select id="qty-select" class="qty-select">
          <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option>
        </select>
      </div>
      <button id="btn-add-cart" class="btn-cart">Add to Cart</button>
      <button id="btn-buy-now" class="btn-buy">Buy Now</button>
      <div class="buy-meta">
        <p><strong>Ships from</strong> Amazing Fulfillment Center</p>
        <p><strong>Sold by</strong> <a href="#">${h(manufacturer)}</a></p>
        <p><strong>Returns</strong> <a href="#">Eligible for Return within 30 days</a></p>
        <p><strong>Payment</strong> Secure transaction</p>
      </div>
    </div>
  </aside>`;
}

/* ── Full product page renderer ────────────────────────────────── */

function renderProduct(productId, d, productContent) {
  const enDesc  = (d.description || []).find(x => x?.descriptionLanguage?.Code === 'en') || {};
  const title   = enDesc.productTitle || d.identifier || productId;
  const gallery = renderGallery(d);
  const hasGallery = !!gallery;

  const gridStyle = hasGallery
    ? ''
    : ' style="grid-template-columns: 1fr 260px;"';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${h(title)} – Amazing.com</title>
  <link rel="icon" href="/assets/amazinglogo.jpg" type="image/jpeg">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
${renderHeader()}
<div id="breadcrumb">
  <a href="/">Amazing.com</a> &rsaquo; <span>${h(title)}</span>
</div>
<main id="product-page"${gridStyle}>
  ${gallery}
  ${renderInfoColumn(productId, d, productContent)}
  ${renderBuyBox(d)}
</main>
${renderFooter()}
<script src="/js/main.js"></script>
</body>
</html>`;
}

/* ── 404 page ──────────────────────────────────────────────────── */

function render404(productId) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Product Not Found – Amazing.com</title>
  <link rel="icon" href="/assets/amazinglogo.jpg" type="image/jpeg">
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
${renderHeader()}
<div style="max-width:600px;margin:60px auto;text-align:center;padding:0 20px;">
  <h1 style="font-size:28px;margin-bottom:16px;">Product not found</h1>
  <p style="color:#555;margin-bottom:24px;">No product with ID <strong>${h(productId)}</strong> exists.</p>
  <a href="/" style="color:#007185;">&#8592; Back to homepage</a>
</div>
${renderFooter()}
</body>
</html>`;
}

/* ── Routes ────────────────────────────────────────────────────── */

app.post('/createProduct', (req, res) => {
  const { productId, productContent } = req.body;
  let { productData } = req.body;

  if (!productId) return res.status(400).json({ error: 'productId is required' });

  if (typeof productData === 'string') {
    try { productData = JSON.parse(productData); }
    catch (e) { return res.status(400).json({ error: 'productData must be valid JSON', detail: e.message }); }
  }

  const safeName = path.basename(String(productId));
  if (!safeName || safeName.includes('..')) {
    return res.status(400).json({ error: 'Invalid productId' });
  }

  const filePath = path.join(ITEMS, `${safeName}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify({ productData: productData || {}, productContent: productContent || '' }, null, 2), 'utf8');
    res.json({ success: true, productId: safeName, url: `/${safeName}` });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save product', detail: e.message });
  }
});

app.get('/:productId', (req, res, next) => {
  const { productId } = req.params;
  if (productId.includes('.')) return next();

  const filePath = path.join(ITEMS, `${productId}.json`);
  if (!fs.existsSync(filePath)) return res.status(404).send(render404(productId));

  try {
    const { productData, productContent } = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    res.send(renderProduct(productId, productData || {}, productContent || ''));
  } catch (e) {
    res.status(500).send(`<p>Error rendering product: ${h(e.message)}</p>`);
  }
});

/* ── Start ─────────────────────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`amazing.com running → http://localhost:${PORT}`);
});

