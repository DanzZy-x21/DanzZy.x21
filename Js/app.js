// 1. EFEK TYPING DASHBOARD
const textTyping = "👋 WELLCOME TO DASHBOARD WEB [ DanzZy.x21 ]";
let i = 0;
function typeWriter() { 
  if (i < textTyping.length) { 
    document.getElementById("typing").innerHTML += textTyping.charAt(i); 
    i++; 
    setTimeout(typeWriter, 50); 
  } 
}

// 2. LANGSUNG JALANIN SAAT WEB DIBUKA
window.addEventListener('DOMContentLoaded', () => {
  typeWriter();       // Jalanin efek ngetik
  loadDataFrontend(); // Ambil data Lynk & Script dari Admin
});

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

// 5. FORM ORDER JOKI & SCRIPT
function bukaOrderJoki(nama, harga) {
  document.getElementById('order-title').innerText = "Order Joki: " + nama;
  document.getElementById('order-item').value = nama; 
  document.getElementById('order-price').value = harga; 
  document.getElementById('order-type').value = "JOKI";
  openModal('modal-order');
}

function bukaOrderScript(nama, harga) {
  document.getElementById('order-title').innerText = "Order Script: " + nama;
  document.getElementById('order-item').value = nama; 
  document.getElementById('order-price').value = harga; 
  document.getElementById('order-type').value = "SCRIPT";
  openModal('modal-order');
}

// 6. SUBMIT ORDER KE CLOUDFLARE API
async function submitOrder(e) {
  e.preventDefault();
  
  const tahun = new Date().getFullYear();
  const kodeUnik = String(Date.now()).slice(-6); 
  const idTransaksi = `DX-${tahun}-${kodeUnik}`;
  
  const dataOrder = {
    trx_id: idTransaksi,
    nama: document.getElementById('order-name').value,
    wa: document.getElementById('order-wa').value,
    item: document.getElementById('order-item').value,
    harga: parseInt(document.getElementById('order-price').value)
  };

  try {
    const response = await fetch('https://danzzy-api.danujaludinandu.workers.dev/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataOrder)
    });

    const result = await response.json();

    if (result.success) {
      alert(`PEMBELIAN SUCCESS!\n\nID Transaksi : ${idTransaksi}\n\nSilakan cek berkala di menu Antrian Joki.`);
      closeModal('modal-order'); 
      document.getElementById('form-order').reset();
    } else {
      alert("Gagal membuat pesanan: " + (result.error || "Error tidak diketahui"));
    }
  } catch (error) {
    alert("Error koneksi ke server. Pastikan API sudah benar.");
  }
}

// 7. CARI ANTRIAN DARI CLOUDFLARE API
async function cariAntrian() {
  const kode = document.getElementById('cari-trx').value.toUpperCase();
  const container = document.getElementById('hasil-antrian');
  
  if (!kode) {
    container.innerHTML = `<p style="color: #ff3b3b;">Masukkan ID Transaksi!</p>`;
    return;
  }

  container.innerHTML = `<p>Mencari data...</p>`;

  try {
    const response = await fetch('https://danzzy-api.danujaludinandu.workers.dev/api/antrian');
    const antrian = await response.json();
    const hasil = antrian.find(a => a.trx_id === kode);

    if (!hasil) {
      container.innerHTML = `<p style="color: #ff3b3b;">Antrian dengan ID tersebut tidak ditemukan.</p>`;
      return;
    }

    container.innerHTML = `
      <div class="item-list" style="flex-direction: column; align-items: flex-start; background: #fff; color: #000; padding: 12px; border-radius: 8px; border: 2px solid #000;">
        <p><b>ID:</b> ${hasil.trx_id}</p>
        <p><b>Nama:</b> ${hasil.nama}</p>
        <p><b>Layanan:</b> ${hasil.item}</p>
        <p><b>Status:</b> <span style="background: ${hasil.status === 'PENDING' ? '#ff9800' : '#4caf50'}; color: #fff; padding: 2px 6px; border-radius: 4px;">${hasil.status}</span></p>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p style="color: #ff3b3b;">Gagal terhubung ke server.</p>`;
  }
}

// 8. LOAD DATA DARI LOCAL (Lynk & Script)
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

// FUNGSI LOGIN & LANDING PAGE
function prosesLoginGoogle() {
  // Sembunyikan layar login
  document.getElementById('screen-login').style.display = 'none';
  
  // Tampilkan layar landing page
  document.getElementById('screen-landing').style.display = 'flex';
  
  // Jalankan animasi landing
  jalankanAnimasiLanding();
}

function jalankanAnimasiLanding() {
  const textHeader = "👋 WELLCOME TO WEB DANZZY.X21";
  let x = 0;
  const typingEl = document.getElementById('landing-typing');
  
  const intervalTyping = setInterval(() => {
    if (x < textHeader.length) { 
      typingEl.innerHTML += textHeader.charAt(x); 
      x++; 
    } else { 
      clearInterval(intervalTyping); 
    }
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
        loadDataFrontend();
      }, 1000);
    }
  }, 30);
}