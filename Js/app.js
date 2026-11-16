// 1. EFEK TYPING DASHBOARD
const textTyping = "👋 WELLCOME TO DASHBOARD WEB [ DanzZy.x21 ]";
let i = 0;
function typeWriter() { if (i < textTyping.length) { document.getElementById("typing").innerHTML += textTyping.charAt(i); i++; setTimeout(typeWriter, 50); } }

// 2. LOGIN & LANDING PAGE
function prosesLoginGoogle() {
  localStorage.setItem('danzzy_user', JSON.stringify({ nama: "User Test" }));
  document.getElementById('screen-login').style.display = 'none';
  document.getElementById('screen-landing').style.display = 'flex';
  jalankanAnimasiLanding();
}

function jalankanAnimasiLanding() {
  const textHeader = "👋 WELLCOME TO WEB DANZZY.X21";
  let x = 0;
  const typingEl = document.getElementById('landing-typing');
  const intervalTyping = setInterval(() => {
    if (x < textHeader.length) { typingEl.innerHTML += textHeader.charAt(x); x++; } else { clearInterval(intervalTyping); }
  }, 40);

  let progress = 0;
  const bar = document.getElementById('loading-bar');
  const intervalBar = setInterval(() => {
    progress += 2; 
    bar.style.width = progress + "%";
    if (progress === 20) document.querySelectorAll('.fade-text')[0].style.opacity = 1;
    if (progress === 50) document.querySelectorAll('.fade-text')[1].style.opacity = 1;
    if (progress === 80) document.querySelectorAll('.fade-text')[2].style.opacity = 1;
    if (progress >= 100) {
      clearInterval(intervalBar);
      setTimeout(() => {
        document.getElementById('screen-landing').style.display = 'none';
        document.getElementById('screen-dashboard').style.display = 'block';
        document.getElementById('bottom-nav').style.display = 'flex';
        typeWriter();
        loadDataFrontend(); // Load data dari admin
      }, 1000);
    }
  }, 30);
}

// 3. NAVIGASI SPA (GANTI HALAMAN)
function kembaliKeDashboard() {
  document.getElementById('screen-antrian').style.display = 'none';
  document.getElementById('screen-support').style.display = 'none';
  document.getElementById('screen-dashboard').style.display = 'block';
}
function bukaAntrian() { document.getElementById('screen-dashboard').style.display = 'none'; document.getElementById('screen-antrian').style.display = 'block'; }
function bukaSupport() { document.getElementById('screen-dashboard').style.display = 'none'; document.getElementById('screen-support').style.display = 'block'; }

// 4. MODAL & TOGGLE
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function toggleBox(id, btn) {
  const el = document.getElementById(id);
  if (el.style.display === "none") { el.style.display = "grid"; btn.innerHTML = "∆"; }
  else { el.style.display = "none"; btn.innerHTML = "▽"; }
}

// 5. FORM ORDER JOKI (TRX ID & NAMA GOOGLE)
function bukaOrderJoki(nama, harga) {
  document.getElementById('order-title').innerText = "Order Joki: " + nama;
  document.getElementById('order-item').value = nama; document.getElementById('order-price').value = harga; document.getElementById('order-type').value = "JOKI";
  const user = JSON.parse(localStorage.getItem('danzzy_user'));
  if(user) document.getElementById('order-name').value = user.nama;
  openModal('modal-order');
}

function bukaOrderScript(nama, harga) {
  document.getElementById('order-title').innerText = "Order Script: " + nama;
  document.getElementById('order-item').value = nama; document.getElementById('order-price').value = harga; document.getElementById('order-type').value = "SCRIPT";
  const user = JSON.parse(localStorage.getItem('danzzy_user'));
  if(user) document.getElementById('order-name').value = user.nama;
  openModal('modal-order');
}

function submitOrder(e) {
  e.preventDefault();
  let antrian = JSON.parse(localStorage.getItem('danzzy_antrian')) || [];
  const noAntrian = antrian.length + 1;
  const tahun = new Date().getFullYear();
  const kodeUnik = String(Date.now()).slice(-6); 
  const idTransaksi = `DX-${tahun}-${kodeUnik}`;

  antrian.push({
    id: Date.now(), idTrx: idTransaksi, noAntrian: noAntrian,
    nama: document.getElementById('order-name').value, wa: document.getElementById('order-wa').value,
    item: document.getElementById('order-item').value, harga: document.getElementById('order-price').value,
    tipe: document.getElementById('order-type').value, status: "PENDING"
  });
  
  localStorage.setItem('danzzy_antrian', JSON.stringify(antrian));
  alert(`PEMBELIAN SUCCESS!\n\nID Transaksi : ${idTransaksi}\nAntrian : ${noAntrian}\nSimpan ID ini untuk cek antrian.`);
  closeModal('modal-order'); document.getElementById('form-order').reset();
}

// 6. CARI ANTRIAN (Berdasarkan ID TRX)
function cariAntrian() {
  const kode = document.getElementById('cari-trx').value.toUpperCase();
  const antrian = JSON.parse(localStorage.getItem('danzzy_antrian')) || [];
  const hasil = antrian.find(a => a.idTrx === kode);

  const container = document.getElementById('hasil-antrian');
  if (!hasil) { container.innerHTML = `<p style="color: #ff3b3b;">Antrian tidak ditemukan.</p>`; return; }

  container.innerHTML = `
    <div class="item-list" style="flex-direction: column; align-items: flex-start; background: #fff; color: #000; padding: 12px; border-radius: 8px;">
      <p><b>ID:</b> ${hasil.idTrx}</p>
      <p><b>Nama:</b> ${hasil.nama}</p>
      <p><b>Layanan:</b> ${hasil.item}</p>
      <p><b>Status:</b> <span style="background: #ff9800; color: #fff; padding: 2px 6px; border-radius: 4px;">${hasil.status}</span></p>
    </div>
  `;
}

// 7. LOAD DATA DARI ADMIN (Lynk & Script)
function loadDataFrontend() {
  let lynks = JSON.parse(localStorage.getItem('danzzy_lynks')) || [];
  if (lynks.length > 0) {
    document.getElementById('lynk-grid').innerHTML = "";
    lynks.forEach(l => { document.getElementById('lynk-grid').innerHTML += `<article class="comic-card"><h3>${l.name}</h3><a href="${l.url}" target="_blank" class="btn-ungu">Buka Link</a></article>`; });
  }

  let scripts = JSON.parse(localStorage.getItem('danzzy_scripts')) || [];
  if (scripts.length > 0) {
    document.getElementById('script-grid').innerHTML = "";
    scripts.forEach(s => { document.getElementById('script-grid').innerHTML += `<article class="comic-card"><h3>${s.title}</h3><p class="price">Rp ${s.price}</p><button class="btn-ungu" onclick="bukaOrderScript('${s.title}', ${s.price})">Beli Script</button></article>`; });
  }
}