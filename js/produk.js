// nav-produk.js
// Penyesuaian: produk default 'Undangan_Cetak', kategori dinamis sesuai produk, filter produk, hapus produk statis, dan tombol 'Muat Lebih Banyak' jika > PRODUK_PER_HALAMAN

const PRODUK_PER_HALAMAN = 20; // Ubah nilai ini untuk mengatur jumlah produk per batch

document.addEventListener('DOMContentLoaded', function() {
    let allData = {};
    let produkList = [];
    let kategoriSet = new Set();
    let produkSelect = document.getElementById('produk');
    let kategoriSelect = document.getElementById('kategori');
    let produkListSection = document.getElementById('produk-list');
    let loadMoreBtn = document.getElementById('load-more');
    let currentIndex = 0;
    let currentList = [];

    fetch('data/produk.json')
        .then(response => response.json())
        .then(data => {
            if (data.updated) {
            window.updated = data.updated;
            }            
            allData = data;
            produkList = Object.keys(data);
            // Isi select produk
            if (produkSelect) {
                produkSelect.innerHTML = produkList.map(p => `<option value="${p}"${p==='Undangan_Cetak'?' selected':''}>${p.replace(/_/g, ' ')}</option>`).join('');
            }
            updateKategori();
            renderProduk(true);
            cekDanSync();
        });

    if (produkSelect) {
        produkSelect.addEventListener('change', function() {
            currentIndex = 0;
            updateKategori();
            renderProduk(true);
        });
    }
    if (kategoriSelect) {
        kategoriSelect.addEventListener('change', function() {
            currentIndex = 0;
            renderProduk(true);
        });
    }

    function updateKategori() {
        const selectedProduk = produkSelect.value || 'Undangan_Cetak';
        kategoriSet = new Set();
        if (allData[selectedProduk]) {
            allData[selectedProduk].forEach(produk => {
                if (produk.kategori) kategoriSet.add(produk.kategori);
            });
        }
        if (kategoriSelect) {
            kategoriSelect.innerHTML = '<option value="">Semua Kategori</option>' +
                Array.from(kategoriSet).map(k => `<option value="${k}">${k}</option>`).join('');
        }
    }

    function renderProduk(reset = false) {
        // Hapus produk dinamis lama
        if (produkListSection && reset) {
            produkListSection.innerHTML = '';
        }
        // Sembunyikan tombol muat lebih banyak lama
        if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
        const selectedProduk = produkSelect.value || 'Undangan_Cetak';
        const selectedKategori = kategoriSelect.value;
        let list = allData[selectedProduk] || [];
        if (selectedKategori) {
            list = list.filter(p => p.kategori === selectedKategori);
        }
        if (reset) {
            currentIndex = 0;
            currentList = list;
        }
        // Tampilkan batch berikutnya
        const nextBatch = currentList.slice(currentIndex, currentIndex + PRODUK_PER_HALAMAN);
        nextBatch.forEach(produk => {
            const div = document.createElement('div');
            div.className = 'w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col produk-item-dinamis';
            div.innerHTML = `
                <a href="${produk.link_produk || '#'}">
                    <img class="hover:grow hover:shadow-lg" src="${produk.img}" alt="${produk.nama}">
                    <div class="pt-3 flex items-center justify-between">
                        <p class="nama-produk">${produk.nama}</p>
                    </div>
                    <p class="keterangan-produk pt-1 text-gray-900">${produk.keterangan || 'Ready'}</p>
                </a>
            `;
            produkListSection.appendChild(div);
        });
        currentIndex += PRODUK_PER_HALAMAN;
        // Tampilkan tombol muat lebih banyak jika masih ada sisa
        if (loadMoreBtn) {
            if (currentIndex < currentList.length) {
                loadMoreBtn.classList.remove('hidden');
                loadMoreBtn.onclick = function() {
                    renderProduk(false);
                };
            } else {
                loadMoreBtn.classList.add('hidden');
            }
        }
    }
});
function cekDanSync() {
  try {
    if (!window.updated) {
      console.log("Belum ada data update, memulai sinkronisasi...");
      syncData();
      return;
    }

    // Misal: '11/6/2025, 19.07.54'
    const [tanggal, waktu] = window.updated.split(', ');

    // Pecah tanggal
    const [hari, bulan, tahun] = tanggal.split('/').map(Number);

    // Pecah waktu
    const [jam, menit, detik] = waktu.split('.').map(Number);

    // Buat objek Date
    const lastUpdate = new Date(tahun, bulan - 1, hari, jam, menit, detik);
    const now = new Date();

    const satuHari = 24 * 60 * 60 * 1000;

    if (now - lastUpdate > satuHari) {
      console.log("Data lebih dari 1 hari, melakukan sinkronisasi ulang...");
      syncData();
    } else {
      console.log("Data masih uptodate, tidak perlu sync.");
    }
  } catch (error) {
    console.error("Format window.updated tidak valid:", error);
    syncData();
  }
}


async function syncData() {
  try {
    const GAS_BASE_URL = "https://script.google.com/macros/s/AKfycbwYIx89d6ij_YaGIp6b51shXvidJ4lADni5syseXZWM6SRlWAxAOa4i2UlSD03AxXzKpQ/exec";

    // Bangun URL lengkap dengan parameter untuk masing-masing permintaan
    const url1 = `${GAS_BASE_URL}?conn=DATABASE=artoprinting_produk`;
    const url2 = `${GAS_BASE_URL}?conn=DATABASE=artoprinting_setting`;
	const url3 = `${GAS_BASE_URL}?conn=DATABASE=artoprinting_ulasan`;

    // Kirim permintaan GET ke Google Apps Script Web App
    const res1 = await fetch(url1);
    const res2 = await fetch(url2);
	const res3 = await fetch(url3);

    const data1 = await res1.json();
    const data2 = await res2.json();
	const data3 = await res3.json();

    if (data1.status === true) {
      console.log("Data Produk berhasil diperbarui.");
    }
	if (data2.status === true) {
      console.log("Data Setting berhasil diperbarui.");
    }
	if (data3.status === true) {
      console.log("Data Ulasan berhasil diperbarui.");
    }
	
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
}

// === TESTIMONI SLIDER ===
(function() {
    const slider = document.getElementById('testimoni-slider');
    const dotsContainer = document.getElementById('testimoni-dots');
    const prevBtn = document.getElementById('testi-prev');
    const nextBtn = document.getElementById('testi-next');
    let ulasan = [];
    let current = 0;
    let perView = 1;
    let autoSlideInterval;

    function getPerView() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 640) return 2;
        return 1;
    }

    function renderSlider() {
        perView = getPerView();
        slider.innerHTML = '';
        const start = current;
        const end = Math.min(current + perView, ulasan.length);
        for (let i = start; i < end; i++) {
            const u = ulasan[i];
            const card = document.createElement('div');
            card.className = 'w-full md:w-1/2 lg:w-1/3 px-2';
            card.innerHTML = `
                <div class="bg-white rounded-lg shadow p-6 h-full flex flex-col items-center text-center">
                    <img src="${u.img}" alt="${u.nama}" class="w-16 h-16 rounded-full mb-4 object-cover border-2 border-blue-200">
                    <p class="text-gray-700 mb-2">"${u.ulasan.replace(/\n/g,'<br>')}"</p>
                    <span class="font-semibold text-blue-700">${u.nama}</span>
                </div>
            `;
            slider.appendChild(card);
        }
        renderDots();
    }

    function renderDots() {
        dotsContainer.innerHTML = '';
        const total = Math.ceil(ulasan.length / perView);
        const maxDots = 5;
        let start = 0;
        // Jika dot lebih dari 5, tampilkan window 5 dot di sekitar current
        if (total > maxDots) {
            const currentDot = Math.floor(current / perView);
            if (currentDot <= 2) {
                start = 0;
            } else if (currentDot >= total - 3) {
                start = total - maxDots;
            } else {
                start = currentDot - 2;
            }
        }
        for (let i = 0; i < Math.min(total, maxDots); i++) {
            const dotIndex = total > maxDots ? start + i : i;
            const dot = document.createElement('button');
            dot.className = 'w-3 h-3 mx-1 rounded-full ' + (dotIndex === Math.floor(current/perView) ? 'bg-blue-500' : 'bg-gray-300');
            dot.onclick = () => { current = dotIndex * perView; renderSlider(); resetAutoSlide(); };
            dotsContainer.appendChild(dot);
        }
    }

    function next() {
        if (current + perView < ulasan.length) {
            current += perView;
        } else {
            current = 0;
        }
        renderSlider();
    }
    function prev() {
        if (current - perView >= 0) {
            current -= perView;
        } else {
            current = (Math.ceil(ulasan.length/perView)-1)*perView;
        }
        renderSlider();
    }
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(next, 6000);
    }
    window.addEventListener('resize', () => {
        perView = getPerView();
        current = Math.floor(current/perView)*perView;
        renderSlider();
    });
    prevBtn && prevBtn.addEventListener('click', () => { prev(); resetAutoSlide(); });
    nextBtn && nextBtn.addEventListener('click', () => { next(); resetAutoSlide(); });
    fetch('data/ulasan.json')
        .then(r => r.json())
        .then(data => {
            ulasan = data.ulasan || [];
            renderSlider();
            resetAutoSlide();
        });
})();
