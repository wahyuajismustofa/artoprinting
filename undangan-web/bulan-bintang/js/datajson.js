//params
function getParam(variabel) {
  const params = new URLSearchParams(window.location.search);
  return params.get(variabel);
}
// variabel global
const idTamu = getParam("id");
const SCRIPT_BASE_URL = "https://script.google.com/macros/s/AKfycbxhUt_yV_55aSsxlh_d7bHYz8lXzrtDR6C_Bopqk_jg0COTshjbMAXQbB8ynIDrUV9U/exec";
const DATABASE_NAME = "test-undangan-web";
let data_update;

async function init() {
  const data = await getData('tamu');
  data_update = data.updated;
  if (data && Array.isArray(data.tamu)) {
  gantiDataDariId(data.tamu);
	buatKomentarDariData();
  document.body.classList.remove("imp-hidden");
	tampilkanRSVP();
	initGiftFormHandler();
	initCommentFormHandler();
  }
}

async function getData(namaFile) {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`./data/${namaFile}.json?t=${timestamp}`);
    if (!response.ok) throw new Error("Gagal mengambil data");
    return await response.json();
  } catch (err) {
    console.error("Error:", err.message);
    return {};
  }
}

async function updateData() {
  try {
    const dataBaru = await getData('tamu');
    if (dataBaru.updated && dataBaru.updated != data_update) {
      showAlert("info", "Perubahan data terdeteksi. Memuat ulang halaman...");
      window.location.reload();
    }
  } catch (err) {
    console.error("Gagal memeriksa pembaruan data:", err.message);
  }
}


function gantiDataDariId(dataTamu) {
  if (isNaN(idTamu)) {
    console.warn("ID tidak ditemukan di URL atau bukan angka.");
    return;
  }

  const tamu = dataTamu.find(item => item.id == idTamu);
  if (!tamu) {
    console.warn("Tamu dengan ID tersebut tidak ditemukan.");
    return;
  }

  const semuaElemen = document.querySelectorAll('[class*="data-"]');
  semuaElemen.forEach(el => {
    const match = el.className.match(/data-([a-zA-Z0-9-_]+)/);
    if (match) {
      const key = match[1];
      if (tamu[key]) {
        el.textContent = tamu[key];
      }
    }
  });
}
// rsvp ---------------------------------------
function buatFormRSVP() {
  return `
    <form action="" method="POST" id="RSVPForm">
      <!-- Status -->
      <div class="rsvp-status-wrap">
        <div class="rsvp-status-head" data-aos="fade-up" data-aos-duration="1200">
          <p class="rsvp-status-caption">Apakah kamu datang?</p>
        </div>
        <div class="rsvp-status-body">
          <div class="rsvp-confirm-wrap">
            <label data-aos="fade-up" data-aos-duration="1200">
              <input type="radio" name="rsvp_status" value="Hadir">
              <div class="rsvp-confirm-btn going">Hadir</div>
            </label>
            <label data-aos="fade-up" data-aos-duration="1200">
              <input type="radio" name="rsvp_status" value="Tidak_Hadir">
              <div class="rsvp-confirm-btn not-going">Tidak Hadir</div>
            </label>
          </div>
        </div>
      </div>

      <!-- Session -->
        <div class="rsvp-session-wrap" id="rsvp-session">
          <div class="session-caption-wrap">
            <p class="caption" data-aos="fade-up" data-aos-duration="1200">Acara mana yang akan Anda hadiri?</p>
          </div>
          <div class="session-btn-wrap">
            <label data-aos="fade-up" data-aos-duration="1200">
              <input type="checkbox" name="selected_event[]" value="Akad_Nikah">
              <div class="rsvp-session-btn">Akad Nikah</div>
            </label>
            <label data-aos="fade-up" data-aos-duration="1200">
              <input type="checkbox" name="selected_event[]" value="Resepsi">
              <div class="rsvp-session-btn">Resepsi</div>
            </label>
          </div>
        </div>

      <!-- Submit -->
      <div class="rsvp-confirm-wrap" data-aos="fade-up" data-aos-duration="1200">
        <button type="submit" class="rsvp-confirm-btn confirm submit">Konfirmasi</button>
      </div>
    </form>
  `;
}

function buatPesanHadir() {
  return `
    <div class="rsvp-message-wrap going" data-aos="fade-up" data-aos-duration="1200">
      <div class="rsvp-message-content">
        <h4 class="rsvp-message-title">Hadir</h4>
        <p class="rsvp-message-caption">Yeyy, terimakasiih sudah mau datang... <br> Sampai jumpa disana ;)</p>
      </div>
    </div>
    <div class="rsvp-change-wrap" data-aos="fade-up" data-aos-duration="1200">
      <div class="rsvp-confirm-wrap">
        <button class="rsvp-confirm-btn confirm" id="changeRSVP">Ubah</button>
      </div>
    </div>
  `;
}

function buatPesanTidakHadir() {
  return `
    <div class="rsvp-message-wrap not-going" data-aos="fade-up" data-aos-duration="1200">
      <div class="rsvp-message-content">
        <h4 class="rsvp-message-title">Tidak Hadir</h4>
        <p class="rsvp-message-caption">Terima kasih atas konfirmasinya. Semoga kita bisa bertemu di lain kesempatan 😊</p>
      </div>
    </div>
    <div class="rsvp-change-wrap" data-aos="fade-up" data-aos-duration="1200">
      <div class="rsvp-confirm-wrap">
        <button class="rsvp-confirm-btn confirm" id="changeRSVP">Ubah</button>
      </div>
    </div>
  `;
}

async function tampilkanRSVP() {
  const data = await getData("tamu");
  const container = document.getElementById("rsvpContainer");

  if (!idTamu || !data.tamu || !container) return;

  const tamu = data.tamu.find(item => item.id == idTamu);
	if (!tamu) return;

	if (tamu.kehadiran === "Hadir") {
	  container.innerHTML = buatPesanHadir();
	} else if (tamu.kehadiran === "Tidak Hadir") {
	  container.innerHTML = buatPesanTidakHadir();
	} else {
	  container.innerHTML = buatFormRSVP();
	  initRSVPFormHandler();
	}
	
  container.addEventListener("click", function (e) {
  if (e.target && e.target.id === "changeRSVP") {
    container.innerHTML = buatFormRSVP();
    initRSVPFormHandler();
  }
  });
}

function initRSVPFormHandler() {
  const form = document.getElementById("RSVPForm");
    if (!form) {
    console.error("Form #RSVPForm tidak ditemukan");
    return;
  }

  form.addEventListener("submit", handleFormRSVP);
  initAttendanceToggle();
}

async function handleFormRSVP(event) {
  event.preventDefault();
  const kehadiran = getAttendanceStatus();
  if (!kehadiran){ return showAlert("error", "Silakan pilih status kehadiran.")};

  const acara = getSelectedEvents();

  try {
    const url = buildUrlRsvp(kehadiran, acara);
    const response = await fetch(url);
    const result = await response.json();
	
	if (result.status){
		showAlert("success", "RSVP berhasil dikirim!");
    setInterval(updateData, 5000); 
	}else{
		showAlert("error", result.error);
	}
  } catch (err) {
    console.error("Gagal mengirim RSVP:", err);
	showAlert("error", "Gagal mengirim data. Silakan coba lagi.");
  }
}

function getAttendanceStatus() {
  const selected = document.querySelector('input[name="rsvp_status"]:checked');
  return selected ? selected.value : null;
}

function initAttendanceToggle() {
  const radios = document.querySelectorAll('input[name="rsvp_status"]');
  const acara = document.getElementById('rsvp-session');

  if (!acara || radios.length === 0) return;

  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === "Tidak_Hadir" && radio.checked) {
        acara.style.display = "none";
      } else if (radio.value === "Hadir" && radio.checked) {
        acara.style.display = "";
      }
    });
  });
}


function getSelectedEvents() {
  const eventCheckboxes = document.querySelectorAll('input[name="selected_event[]"]:checked');
  const values = Array.from(eventCheckboxes).map(cb => cb.value);
  return values.length > 0 ? values.join(", ").replace(/\s+/g, "_") : "Tidak_memilih_acara";
}


function buildUrlRsvp(kehadiran, acara) {
  const query = `UPDATE tamu SET kehadiran=${encodeURIComponent(kehadiran)},acara=${encodeURIComponent(acara)} WHERE id=${idTamu}`;
  return `${SCRIPT_BASE_URL}?conn=DATABASE=${DATABASE_NAME}&data=${query}`;
}
// kado ---------------------------------------
function initGiftFormHandler() {
  const form = document.getElementById("weddingGiftForm");
    if (!form) {
    console.error("Form #weddingGiftForm tidak ditemukan");
    return;
  }

  form.addEventListener("submit", handleFormGift);
}

async function handleFormGift(event) {
  event.preventDefault();
  const form = document.getElementById("weddingGiftForm");
  const akun = form.querySelector('[name="nama-akun"]').value.trim();
  const pesan = form.querySelector('[name="pesan"]').value.trim().replace(/ /g, "_").replace(/,/g, "--koma--");
  const nominal = form.querySelector('[name="nominal"]').value.trim();
  if (!akun || !pesan || !nominal) return alert("Silakan lengkapi data kado");

  try {
    const url = buildUrlGift(akun,pesan,nominal);
    const response = await fetch(url);
    const result = await response.json();
	if (result.status){
		showAlert("success", "Konfirmasi kado berhasil dikirim!");
    setInterval(updateData, 5000); 
	}else{
		showAlert("error", result.error);
	}
  } catch (err) {
    console.error("Gagal mengirim konfirmasi kado:", err);
    showAlert("error", "Gagal mengirim data. Silakan coba lagi.");
  }
}
function buildUrlGift(akun,pesan,nominal) {
  const query = `UPDATE kado SET akun=${encodeURIComponent(akun)},pesan=${encodeURIComponent(pesan)},nominal=${encodeURIComponent(nominal)} WHERE id=${idTamu}`;
  return `${SCRIPT_BASE_URL}?conn=DATABASE=${DATABASE_NAME}&data=${query}`;
}
// komentar -----------------------------------
function initCommentFormHandler() {
  const form = document.getElementById("weddingWishForm");
    if (!form) {
    console.error("Form #weddingWishForm tidak ditemukan");
    return;
  }

  form.addEventListener("submit", handleFormComment);
}

async function handleFormComment(event) {
  event.preventDefault();
  const komentar = getComment();
  if (!komentar) return alert("Silakan isi pesan anda.");

  try {
    const url = buildUrlComment(komentar);
    const response = await fetch(url);
    const result = await response.json();

	if (result.status){
		showAlert("success", "Pesan berhasil dikirim!");
    setInterval(updateData, 5000); 
	}else{
		showAlert("error", result.error);
	}
  } catch (err) {
    console.error("Gagal mengirim Pesan:", err);
	showAlert("error", "Gagal mengirim data. Silakan coba lagi.");
  }
}

function getComment() {
  const komentar = document.querySelector('textarea[name="comment"]');
  if (!komentar) return null;

  return komentar.value
    .trim()
    .replace(/,/g, "--koma--")
    .replace(/ /g, "_");
}


function buildUrlComment(komentar) {
  const now = new Date();
  const waktu = [
    String(now.getDate()).padStart(2, '0'),
    String(now.getMonth() + 1).padStart(2, '0'),
    now.getFullYear()
  ].join('/') + '_' +
  [
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0')
  ].join(':');
  const query = `UPDATE tamu SET waktu-pesan=${encodeURIComponent(waktu)},pesan=${encodeURIComponent(komentar)} WHERE id=${idTamu}`;
  return `${SCRIPT_BASE_URL}?conn=DATABASE=${DATABASE_NAME}&data=${query}`;
}

async function buatKomentarDariData() {
  const data = await getData('tamu');
  if (!data || !Array.isArray(data.tamu)) return;

  const komentarContainer = document.getElementById("comment-container");
  if (!komentarContainer) {
    console.warn("Elemen container komentar tidak ditemukan.");
    return;
  }

  data.tamu.forEach((tamu, index) => {
    // Hanya buat komentar jika ada isi pesan
    if (tamu.pesan && tamu.pesan.trim() !== "") {
      const item = document.createElement("div");
      item.className = "comment-item aos-init aos-animate";
      item.id = `comment${tamu.id || index}`;
      item.setAttribute("data-aos", "fade-up");
      item.setAttribute("data-aos-duration", "1200");
      item.style.opacity = "1";
      item.style.transitionDuration = "1200ms";

      const nama = tamu.nama || "Tamu";
      const tanggal = formatTanggal(tamu["waktu-pesan"]);
      const pesan = tamu.pesan;

      item.innerHTML = `
        <div class="comment-head">
          <h3 class="comment-name">${escapeHtml(nama)}</h3>
          <small class="comment-date">${tanggal}</small>
        </div>
        <div class="comment-body">
          <p class="comment-caption">${escapeHtml(pesan)}</p>
        </div>
      `;

      komentarContainer.appendChild(item);
    }
  });
}
// Format ISO date ke "dd MMM yyyy, HH:mm"
function formatTanggal(isoString) {
  if (!isoString) return "-";
  const tanggal = new Date(isoString);
  return tanggal.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).replace(",", "");
}

// Escape HTML untuk keamanan
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
// alert
function showAlert(jenis, pesan) {
  const alertBox = document.getElementById("alert");
  const alertText = alertBox.querySelector(".alert-text");
  const alertClose = alertBox.querySelector(".alert-close");

  // Reset dulu
  alertBox.className = `alert show ${jenis}`;
  alertText.textContent = pesan;

  // Hapus sebelumnya kalau ada
  if (alertBox._timeoutId) clearTimeout(alertBox._timeoutId);

  // Tutup otomatis setelah 5 detik
  alertBox._timeoutId = setTimeout(() => {
    closeAlert();
  }, 5000);

  // Klik tombol X untuk menutup
  alertClose.onclick = () => {
    closeAlert();
  };
}

function closeAlert() {
  const alertBox = document.getElementById("alert");
  alertBox.className = "alert hide";
  if (alertBox._timeoutId) {
    clearTimeout(alertBox._timeoutId);
    alertBox._timeoutId = null;
  }
}

init();