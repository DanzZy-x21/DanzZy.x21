const PIN_ADMIN = "211110";

function cekPin() {
  const pin = document.getElementById('pin-input').value;
  if (pin === PIN_ADMIN) {
    document.getElementById('login-panel').style.display = "none";
    document.getElementById('admin-panel').style.display = "block";
    muatSemuaData();
  } else {
    document.getElementById('pin-err').style.display = "block";
  }
}

function muatSemuaData() {
  renderAntrian();
  renderLynk();
  renderScript();
  renderListTesti();
}

// --- ANTRIAN JOKI ---
function renderAntrian() {
  const container = document.getElementById('antrian-container');
  const antrian = JSON.parse(localStorage.getItem('danzzy_antrian')) || [];
  container.innerHTML = "";
  const pending = antrian.filter(a => a.status === "PENDING");
  
  if (pending.length === 0) { container.innerHTML = `<p style="font-size: 0.8rem; color: #888;">Belum ada antrian masuk.</p>`; return; }

  pending.forEach((order) => {
    const card = document.createElement('div');
    card.style.cssText = "background: #fff; color: #000; border-radius: 8px; padding: 12px; border: 2px solid #000; box-shadow: 3px 3px 0 #7B2CBF; margin-bottom: 12px;";
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; border-bottom: 2px dashed #ccc; padding-bottom: 8px; margin-bottom: 8px;">
        <h4 style="font-size: 0.9rem; margin: 0;">Antrian #${order.noAntrian}</h4>
        <span style="background: #7B2CBF; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; font-weight: bold;">${order.idTrx}</span>
      </div>
      <div style="background: #f0f0f0; padding: 8px; border-radius: 6px; font-family: monospace; font-size: 0.75rem; margin-bottom: 8px; white-space: pre-wrap;">✨ SAVE BUYER FRESH SULTAN DanzZy.x21 ✨\n\nSAVE : ${order.nama}\nNOMER : wa.me/${order.wa}\n\nITEM : ${order.item} (${order.tipe})</div>
      <div style="display: flex; gap: 8px;">
        <button onclick="ubahStatus(${order.id})" class="btn-ungu" style="background: #4caf50; color: #fff;">TERIMA, NEXT</button>
        <button onclick="hapusAntrian(${order.id})" class="btn-ungu" style="background: #d32f2f; color: #fff;">TOLAK</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function ubahStatus(id) {
  let antrian = JSON.parse(localStorage.getItem('danzzy_antrian')) || [];
  antrian = antrian.map(o => o.id === id ? { ...o, status: 'SELESAI' } : o);
  localStorage.setItem('danzzy_antrian', JSON.stringify(antrian));
  renderAntrian();
}

function hapusAntrian(id) {
  let antrian = JSON.parse(localStorage.getItem('danzzy_antrian')) || [];
  antrian = antrian.filter(o => o.id !== id);
  localStorage.setItem('danzzy_antrian', JSON.stringify(antrian));
  renderAntrian();
}

// --- LYNK ---
function tambahLynk() {
  const name = document.getElementById('lynk-name').value;
  const url = document.getElementById('lynk-url').value;
  if(!name || !url) return alert("Isi semua data!");
  let lynks = JSON.parse(localStorage.getItem('danzzy_lynks')) || [];
  lynks.push({ id: Date.now(), name, url });
  localStorage.setItem('danzzy_lynks', JSON.stringify(lynks));
  document.getElementById('lynk-name').value = ""; document.getElementById('lynk-url').value = "";
  renderLynk();
}
function renderLynk() {
  const container = document.getElementById('list-lynk');
  let lynks = JSON.parse(localStorage.getItem('danzzy_lynks')) || [];
  container.innerHTML = lynks.length === 0 ? "Belum ada lynk." : "";
  lynks.forEach(l => {
    container.innerHTML += `<div class="item-list"><span><b>${l.name}</b></span><button class="btn-del" onclick="hapusLynk(${l.id})">Hapus</button></div>`;
  });
}
function hapusLynk(id) {
  let lynks = JSON.parse(localStorage.getItem('danzzy_lynks')) || [];
  lynks = lynks.filter(l => l.id !== id);
  localStorage.setItem('danzzy_lynks', JSON.stringify(lynks));
  renderLynk();
}

// --- SCRIPT ---
function tambahScript() {
  const title = document.getElementById('script-title').value;
  const price = document.getElementById('script-price').value;
  if(!title || !price) return alert("Isi semua data!");
  let scripts = JSON.parse(localStorage.getItem('danzzy_scripts')) || [];
  scripts.push({ id: Date.now(), title, price });
  localStorage.setItem('danzzy_scripts', JSON.stringify(scripts));
  document.getElementById('script-title').value = ""; document.getElementById('script-price').value = "";
  renderScript();
}
function renderScript() {
  const container = document.getElementById('list-script');
  let scripts = JSON.parse(localStorage.getItem('danzzy_scripts')) || [];
  container.innerHTML = scripts.length === 0 ? "Belum ada script." : "";
  scripts.forEach(s => {
    container.innerHTML += `<div class="item-list"><span><b>${s.title}</b> - Rp ${s.price}</span><button class="btn-del" onclick="hapusScript(${s.id})">Hapus</button></div>`;
  });
}
function hapusScript(id) {
  let scripts = JSON.parse(localStorage.getItem('danzzy_scripts')) || [];
  scripts = scripts.filter(s => s.id !== id);
  localStorage.setItem('danzzy_scripts', JSON.stringify(scripts));
  renderScript();
}

// --- TESTIMONI (Anti-Screenshot) ---
function tambahTesti() {
  const trx = document.getElementById('t-trx').value;
  const item = document.getElementById('t-item').value;
  const nominal = document.getElementById('t-nominal').value;
  const fileInput = document.getElementById('t-foto');
  if(!trx || !item || !nominal || fileInput.files.length === 0) return alert("Isi semua data dan upload foto!");
  
  const reader = new FileReader();
  reader.onload = function(e) {
    let testis = JSON.parse(localStorage.getItem('danzzy_testimoni')) || [];
    testis.push({ id: Date.now(), trx, item, nominal, foto: e.target.result });
    localStorage.setItem('danzzy_testimoni', JSON.stringify(testis));
    alert("Testimoni berhasil ditambahkan!");
    document.getElementById('t-trx').value = ""; document.getElementById('t-item').value = ""; document.getElementById('t-nominal').value = ""; fileInput.value = "";
    renderListTesti();
  };
  reader.readAsDataURL(fileInput.files[0]);
}
function renderListTesti() {
  const container = document.getElementById('list-testi');
  let testis = JSON.parse(localStorage.getItem('danzzy_testimoni')) || [];
  container.innerHTML = testis.length === 0 ? "Belum ada testimoni." : "";
  testis.forEach(t => {
    container.innerHTML += `<div class="item-list"><span><b>${t.trx}</b> - ${t.item}</span><button class="btn-del" onclick="hapusTesti(${t.id})">Hapus</button></div>`;
  });
}
function hapusTesti(id) {
  let testis = JSON.parse(localStorage.getItem('danzzy_testimoni')) || [];
  testis = testis.filter(t => t.id !== id);
  localStorage.setItem('danzzy_testimoni', JSON.stringify(testis));
  renderListTesti();
}