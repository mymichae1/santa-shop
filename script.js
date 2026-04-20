/* ============================================================
   DATA
============================================================ */
const PRODUCTS = [
  { id:1, name:"Drum Dekorasi",    price:10.75, img:"assets/shopping-1.jpg", cat:"Dekorasi", rating:4.8, badge:"Best Seller", desc:"Drum mini cantik untuk dekorasi Natal rumahmu." },
  { id:2, name:"Bel Dekorasi",     price:75.50, img:"assets/shopping-2.jpg", cat:"Dekorasi", rating:4.9, badge:"Terlaris",    desc:"Bel klasik dengan kilau emas yang elegan." },
  { id:3, name:"Santa Cap Pack",   price:20.00, img:"assets/shopping-3.jpg", cat:"Pakaian",  rating:4.6, badge:"",            desc:"Paket topi Santa imut untuk seluruh keluarga." },
  { id:4, name:"Hadiah Dekorasi",  price:112.0, img:"assets/shopping-4.jpg", cat:"Hadiah",   rating:4.9, badge:"Premium",    desc:"Set dekorasi hadiah mewah pilihan terbaik." },
  { id:5, name:"Pohon Natal Mini", price:45.00, img:"assets/shopping-1.jpg", cat:"Dekorasi", rating:4.7, badge:"Baru",       desc:"Pohon Natal mungil cocok untuk meja kerja." },
  { id:6, name:"Kue Natal Spesial",price:18.50, img:"assets/shopping-2.jpg", cat:"Kue",      rating:4.8, badge:"",            desc:"Kue Natal homemade dengan resep tradisional." },
  { id:7, name:"Mainan Rusa Natal",price:32.00, img:"assets/shopping-3.jpg", cat:"Mainan",   rating:4.5, badge:"",            desc:"Mainan rusa Natal lucu untuk si kecil." },
  { id:8, name:"Gift Box Mewah",   price:88.00, img:"assets/shopping-4.jpg", cat:"Hadiah",   rating:5.0, badge:"Eksklusif",  desc:"Kotak hadiah premium dengan pita emas." },
];

const REVIEWS_DATA = [
  { name:"Budi Santoso",   initial:"B", text:"Produknya berkualitas tinggi dan pengiriman super cepat! Sangat puas berbelanja di Santa Shop.",              stars:5 },
  { name:"Dewi Rahayu",    initial:"D", text:"Paket hadiah yang dikirim sangat cantik dan rapi. Orang yang aku kirimi langsung senang sekali!",            stars:5 },
  { name:"Andi Pratama",   initial:"A", text:"Harga terjangkau untuk kualitas premium. Pasti akan terus berbelanja di sini setiap Natal!",                 stars:4 },
  { name:"Siti Nurhaliza", initial:"S", text:"Layanan customer service sangat responsif. Masalah pesananku langsung diselesaikan dengan cepat.",           stars:5 },
  { name:"Reza Mahendra",  initial:"R", text:"Kemasan produk aman dan tidak ada yang rusak. Pilihan produknya juga banyak dan lengkap.",                   stars:4 },
  { name:"Maya Putri",     initial:"M", text:"Sudah langganan 2 tahun dan tidak pernah kecewa. Santa Shop memang yang terbaik untuk Natal!",               stars:5 },
];

/* ============================================================
   STATE
============================================================ */
let cart = [];
let selectedPayment = "";
let currentOrderId  = "";
let currentStep     = 1;
let selectedStars   = 0;
let reviews         = [...REVIEWS_DATA];

/* ============================================================
   RENDER PRODUCTS
============================================================ */
function renderProducts(list) {
  const grid = document.getElementById("products-grid");
  if (!list.length) {
    grid.innerHTML = `<p style="text-align:center;color:var(--text-light);padding:2rem;grid-column:1/-1;">Produk tidak ditemukan.</p>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product__card reveal">
      ${p.badge ? `<div class="product__badge">${p.badge}</div>` : ""}
      <div class="product__img-wrap">
        <img src="${p.img}" alt="${p.name}"/>
      </div>
      <div class="product__info">
        <p class="product__name">${p.name}</p>
        <p class="product__price">Rp ${(p.price*16000).toLocaleString("id-ID")}</p>
        <p class="product__rating">${"★".repeat(Math.round(p.rating))} <span style="color:var(--text-light);">(${p.rating})</span></p>
        <p class="product__desc">${p.desc}</p>
      </div>
      <button class="product__add-btn" onclick="addToCart(${p.id})">
        <i class="ri-shopping-basket-line"></i> Tambah ke Keranjang
      </button>
    </div>
  `).join("");
  initReveal();
}

function renderShoppingGrid(list) {
  const grid = document.getElementById("shopping-grid");
  grid.innerHTML = list.map(p => `
    <div class="shopping__card reveal">
      <h3>Rp ${(p.price*16000).toLocaleString("id-ID")}</h3>
      <img src="${p.img}" alt="${p.name}"/>
      <h4>${p.name}</h4>
      <button class="shopping__cart-btn" onclick="addToCart(${p.id})">
        <i class="ri-shopping-basket-line"></i> Tambah ke Keranjang
      </button>
    </div>
  `).join("");
  initReveal();
}

function liveSearch(q) {
  q = q.toLowerCase().trim();
  // sync both search inputs
  document.getElementById("nav-search-input").value = q;
  document.getElementById("prod-search").value = q;
  const filtered = q === "" ? PRODUCTS : PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
  );
  renderProducts(filtered);
  if (q) document.getElementById("all-product").scrollIntoView({behavior:"smooth"});
}

function filterByCategory(cat) {
  const filtered = cat === "" ? PRODUCTS : PRODUCTS.filter(p => p.cat === cat);
  renderProducts(filtered);
  document.getElementById("all-product").scrollIntoView({behavior:"smooth"});
}

/* ============================================================
   CART
============================================================ */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({...p, qty:1});
  updateBadge();
  showToast(`${p.name} ditambahkan ke keranjang 🛒`);
}

function updateBadge() {
  document.getElementById("cart-badge").textContent = cart.reduce((s,c)=>s+c.qty,0);
}

function renderCart() {
  const el = document.getElementById("cart-content");
  if (!cart.length) {
    el.innerHTML = `<div class="cart__empty"><i class="ri-shopping-basket-line"></i>Keranjangmu masih kosong</div>`;
    return;
  }
  const total = cart.reduce((s,c)=>s+(c.price*c.qty*16000),0);
  el.innerHTML = `
    <div class="cart__list">
      ${cart.map(c=>`
        <div class="cart__item">
          <img class="cart__item-img" src="${c.img}" alt="${c.name}"/>
          <div class="cart__item-info">
            <div class="cart__item-name">${c.name}</div>
            <div class="cart__item-price">Rp ${(c.price*c.qty*16000).toLocaleString("id-ID")}</div>
          </div>
          <div class="cart__qty">
            <button class="cart__qty-btn" onclick="changeQty(${c.id},-1)">−</button>
            <span class="cart__qty-val">${c.qty}</span>
            <button class="cart__qty-btn" onclick="changeQty(${c.id},+1)">+</button>
          </div>
          <button class="cart__remove" onclick="removeItem(${c.id})"><i class="ri-delete-bin-2-line"></i></button>
        </div>
      `).join("")}
    </div>
    <div class="cart__total">
      <span class="cart__total-label">Total</span>
      <span class="cart__total-val">Rp ${total.toLocaleString("id-ID")}</span>
    </div>
    <button class="cart__checkout-btn" onclick="startCheckout()">
      <i class="ri-secure-payment-line"></i> Checkout Sekarang
    </button>`;
}

function changeQty(id, delta) {
  const item = cart.find(x=>x.id===id);
  if (item) { item.qty += delta; if (item.qty<=0) cart=cart.filter(x=>x.id!==id); }
  updateBadge(); renderCart();
}

function removeItem(id) {
  cart = cart.filter(x=>x.id!==id);
  updateBadge(); renderCart();
  showToast("Produk dihapus dari keranjang");
}

function openCartModal() { renderCart(); openModal("cart-overlay"); }

/* ============================================================
   CHECKOUT
============================================================ */
function startCheckout() {
  if (!cart.length) { showToast("Keranjang masih kosong!"); return; }
  closeModal("cart-overlay");
  currentStep = 1;
  updateStepUI();
  openModal("checkout-overlay");
}

function goStep(n) {
  if (n===2 && !document.getElementById("co-address").value.trim()) {
    showToast("Harap lengkapi alamat pengiriman!"); return;
  }
  if (n===3) renderOrderSummary();
  currentStep = n;
  updateStepUI();
  document.querySelectorAll(".checkout__panel").forEach(p=>p.classList.remove("active"));
  document.getElementById("cs-"+n).classList.add("active");
}

function updateStepUI() {
  for (let i=1;i<=3;i++) {
    const t = document.getElementById("cs-tab-"+i);
    t.classList.remove("active","done");
    if (i<currentStep) t.classList.add("done");
    else if (i===currentStep) t.classList.add("active");
  }
}

function selectPayment(el, method) {
  document.querySelectorAll(".payment__method").forEach(m=>m.classList.remove("selected"));
  el.classList.add("selected");
  selectedPayment = method;
  const accounts = {
    Mandiri:"1700 0070 1234 5678", BRI:"0096-01-123456-50-8",
    BNI:"0123 4567 89", BCA:"1230 4567 89", QRIS:"Scan QR Code di aplikasi pembayaran"
  };
  const total = cart.reduce((s,c)=>s+(c.price*c.qty*16000),0);
  const box = document.getElementById("pay-detail");
  box.classList.add("show");
  document.getElementById("pay-account").textContent = `${method}: ${accounts[method]}`;
  document.getElementById("pay-amount").textContent  = `Jumlah: Rp ${total.toLocaleString("id-ID")}`;
}

function renderOrderSummary() {
  const total = cart.reduce((s,c)=>s+(c.price*c.qty*16000),0);
  const name  = document.getElementById("co-name").value    || "(tidak diisi)";
  const addr  = document.getElementById("co-address").value || "(tidak diisi)";
  document.getElementById("order-summary").innerHTML = `
    <div class="order-summary-row"><span>Penerima:</span><span>${name}</span></div>
    <div class="order-summary-row"><span>Alamat:</span><span style="max-width:240px;text-align:right;">${addr}</span></div>
    <div class="order-summary-row"><span>Pembayaran:</span><span>${selectedPayment || "(belum dipilih)"}</span></div>
    <hr style="margin:.75rem 0;border:none;border-top:1.5px solid #ddd;"/>
    ${cart.map(c=>`<div class="order-summary-row"><span>${c.name} ×${c.qty}</span><span>Rp ${(c.price*c.qty*16000).toLocaleString("id-ID")}</span></div>`).join("")}
    <div class="order-summary-total"><span>Total Pembayaran</span><span>Rp ${total.toLocaleString("id-ID")}</span></div>`;
}

function processPayment() {
  if (!selectedPayment) { showToast("Pilih metode pembayaran terlebih dahulu!"); return; }
  currentOrderId = "SS-" + Date.now().toString().slice(-6);
  cart = []; updateBadge();
  closeModal("checkout-overlay");
  document.getElementById("success-order-id").textContent = currentOrderId;
  openModal("success-overlay");
  // Pre-fill tracking
  document.getElementById("tracking-input").value = currentOrderId;
  renderTrackingSteps("current");
}

/* ============================================================
   TRACKING
============================================================ */
function trackOrder() {
  const val = document.getElementById("tracking-input").value.trim();
  if (!val) { showToast("Masukkan nomor pesanan!"); return; }
  renderTrackingSteps("current");
}

function renderTrackingSteps(status) {
  const now = new Date();
  const fmt = d => d.toLocaleString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
  const steps = [
    { icon:"ri-checkbox-circle-line", title:"Pesanan Diterima",     desc:"Pesananmu berhasil dibuat dan dikonfirmasi.", time: fmt(new Date(now-4*60000)),  state:"done" },
    { icon:"ri-box-3-line",           title:"Sedang Dikemas",       desc:"Tim kami sedang mempersiapkan produkmu.",     time: fmt(new Date(now-3*60000)),  state:"done" },
    { icon:"ri-truck-line",           title:"Sedang Dikirim",       desc:"Kurir sedang mengantar ke alamatmu.",         time: fmt(new Date(now+60000)),    state:"current" },
    { icon:"ri-home-4-line",          title:"Sampai di Tujuan",     desc:"Paket telah tiba di alamat penerima.",        time:"Estimasi 2–3 hari",          state:"" },
  ];
  document.getElementById("tracking-timeline").innerHTML = steps.map((s,i) => `
    <div class="track-step ${s.state}">
      <div class="track-step__left">
        <div class="track-step__dot"><i class="${s.icon}"></i></div>
        ${i<steps.length-1 ? '<div class="track-step__line"></div>' : ""}
      </div>
      <div class="track-step__body">
        <div class="track-step__title">${s.title}</div>
        <div class="track-step__desc">${s.desc}</div>
        ${s.time ? `<div class="track-step__time">${s.time}</div>` : ""}
      </div>
    </div>
  `).join("");
}

/* ============================================================
   REVIEWS
============================================================ */
function renderReviews() {
  const grid = document.getElementById("reviews-grid");
  grid.innerHTML = reviews.slice(0,6).map(r => `
    <div class="review__card reveal">
      <div class="review__stars">${"★".repeat(r.stars)}${"☆".repeat(5-r.stars)}</div>
      <p class="review__text">"${r.text}"</p>
      <div class="review__author">
        <div class="review__avatar">${r.initial}</div>
        <div>
          <div class="review__name">${r.name}</div>
          <div class="review__role">Pelanggan Santa Shop</div>
        </div>
      </div>
    </div>
  `).join("");
  initReveal();
}

// Star picker
let starPickerVal = 0;
document.querySelectorAll(".star-picker i").forEach((s,i)=>{
  s.addEventListener("mouseover",()=>highlightStars(i+1));
  s.addEventListener("mouseout", ()=>highlightStars(starPickerVal));
  s.addEventListener("click",    ()=>{ starPickerVal=i+1; selectedStars=starPickerVal; highlightStars(starPickerVal); });
});
function highlightStars(n) {
  document.querySelectorAll(".star-picker i").forEach((s,i)=>s.classList.toggle("lit",i<n));
}

function submitReview() {
  const name = document.getElementById("rv-name").value.trim();
  const text = document.getElementById("rv-text").value.trim();
  if (!name||!text||!selectedStars) { showToast("Isi nama, pesan, dan pilih bintang!"); return; }
  reviews.unshift({name, initial:name[0].toUpperCase(), text, stars:selectedStars});
  renderReviews();
  document.getElementById("rv-name").value = "";
  document.getElementById("rv-text").value = "";
  selectedStars = starPickerVal = 0;
  highlightStars(0);
  showToast("Ulasan berhasil dikirim! Terima kasih 🎉");
}

/* ============================================================
   AUTH
============================================================ */
function switchAuth(tab) {
  document.querySelectorAll(".auth__tab").forEach((t,i)=>{
    t.classList.toggle("active",(i===0&&tab==="login")||(i===1&&tab==="register"));
  });
  document.getElementById("login-panel").classList.toggle("active", tab==="login");
  document.getElementById("register-panel").classList.toggle("active", tab==="register");
}
function doLogin() {
  const e=document.getElementById("login-email").value,
        p=document.getElementById("login-pass").value;
  if(!e||!p){showToast("Lengkapi email dan password!");return;}
  closeModal("auth-overlay");
  showToast("Berhasil masuk! Selamat datang 👋");
}
function doRegister() {
  const n=document.getElementById("reg-name").value,
        e=document.getElementById("reg-email").value,
        p=document.getElementById("reg-pass").value,
        c=document.getElementById("reg-confirm").value;
  if(!n||!e||!p||!c){showToast("Harap lengkapi semua kolom!");return;}
  if(p!==c){showToast("Password tidak cocok!");return;}
  closeModal("auth-overlay");
  showToast("Akun berhasil dibuat! Selamat bergabung 🎄");
}

/* ============================================================
   GIFT
============================================================ */
function sendGift() {
  const f=document.getElementById("g-from-name").value,
        t=document.getElementById("g-to-name").value;
  if(!f||!t){showToast("Isi nama pengirim dan penerima!");return;}
  closeModal("gift-overlay");
  showToast("Hadiah berhasil dijadwalkan untuk dikirim! 🎁");
}

function joinCoupon(e) {
  e.preventDefault();
  showToast("Berhasil! Kupon akan dikirim ke emailmu 🎉");
}

/* ============================================================
   MODAL HELPERS
============================================================ */
function openModal(id)  { document.getElementById(id).classList.add("open"); }
function closeModal(id) { document.getElementById(id).classList.remove("open"); }

document.querySelectorAll(".overlay").forEach(ov=>{
  ov.addEventListener("click", e=>{ if(e.target===ov) ov.classList.remove("open"); });
});

/* ============================================================
   HAMBURGER
============================================================ */
function toggleMobileMenu(){document.getElementById("mobile-menu").classList.toggle("open");}
function closeMobileMenu(){document.getElementById("mobile-menu").classList.remove("open");}

/* ============================================================
   TOAST
============================================================ */
function showToast(msg) {
  const t=document.getElementById("toast");
  document.getElementById("toast-msg").textContent=msg;
  t.classList.add("show");
  clearTimeout(t._tid);
  t._tid=setTimeout(()=>t.classList.remove("show"),3000);
}

/* ============================================================
   SNOW — FEATURE 3
============================================================ */
(function(){
  const canvas=document.getElementById("snow-canvas");
  const ctx=canvas.getContext("2d");
  let flakes=[];
  function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; }
  resize(); window.addEventListener("resize",resize);
  for(let i=0;i<140;i++) flakes.push({
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight,
    r:Math.random()*4+1.5,
    speed:Math.random()*1.2+0.4,
    wind:Math.random()*.5-.25,
    alpha:Math.random()*.6+.25
  });
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    flakes.forEach(f=>{
      ctx.beginPath();
      ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${f.alpha})`;
      ctx.fill();
      f.y+=f.speed; f.x+=f.wind;
      if(f.y>canvas.height){f.y=-10;f.x=Math.random()*canvas.width;}
      if(f.x>canvas.width)f.x=0;
      if(f.x<0)f.x=canvas.width;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   AUDIO TOGGLE — FEATURE 4
============================================================ */
(function(){
  const audio=document.getElementById("bg-audio");
  const btn=document.getElementById("audio-btn");
  let playing=false;
  btn.addEventListener("click",()=>{
    if(playing){audio.pause();btn.textContent="🔇";playing=false;}
    else{audio.play().catch(()=>{});btn.textContent="🔈";playing=true;}
  });
})();

/* ============================================================
   SCROLL REVEAL — FEATURE 19
============================================================ */
function initReveal(){
  const els=document.querySelectorAll(".reveal:not(.visible)");
  if(!els.length)return;
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add("visible"); obs.unobserve(e.target); }
    });
  },{threshold:.12});
  els.forEach(el=>obs.observe(el));
}

/* ============================================================
   INIT
============================================================ */
renderProducts(PRODUCTS.slice(0,8));
renderShoppingGrid(PRODUCTS.slice(0,4));
renderReviews();
renderTrackingSteps("current");
initReveal();
