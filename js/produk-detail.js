// produk-detail.js
// Script untuk menampilkan detail produk secara dinamis berdasarkan parameter p (sheet) dan id

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function fetchProdukData(sheet) {
    try {
        const res = await fetch('data/produk.json');
        const data = await res.json();
        return data[sheet] || [];
    } catch (e) {
        return [];
    }
}

function renderProdukDetail(produk) {
    const container = document.getElementById('produk-detail');
    if (!produk) {
        container.innerHTML = '<div class="w-full text-center text-red-600 font-semibold">Produk tidak ditemukan.</div>';
        return;
    }
    container.innerHTML = `
        <div class="w-full md:w-1/2 flex-shrink-0 flex justify-center items-center">
            <img src="${produk.img || 'https://ik.imagekit.io/mustofa/web/img/logo-artoprinting%201x1.png'}" alt="${produk.nama || ''}" class="rounded-lg shadow max-h-72 object-contain bg-gray-100 w-full max-w-xs">
        </div>
        <div class="w-full md:w-1/2 flex flex-col gap-4">
            <h1 class="text-2xl font-bold text-gray-900 mb-2">${produk.nama || '-'}</h1>
            <div class="text-gray-700 mb-2">${produk.keterangan || '-'}</div>
            <div class="text-gray-800 font-semibold">Kategori: <span class="text-blue-700">${produk.kategori || '-'}</span></div>
            ${produk.harga ? `<div class="text-lg font-bold text-green-700">Harga: Rp${produk.harga.toLocaleString('id-ID')}</div>` : ''}
            <a href="https://wa.me/6285712110870?text=Halo%20Arto%20Printing,%20saya%20ingin%20pesan%20produk%20${encodeURIComponent(produk.nama || '')}" target="_blank" rel="noopener" class="inline-flex items-center px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition focus:outline-none focus:ring-2 focus:ring-green-400 mt-4">
                <svg class="w-5 h-5 mr-2" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#25D366"/><path d="M22.2 18.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.5.2-.2.2-.3.3-.5.1-.2.1-.4 0-.5-.1-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5l-.6-.01c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5c0 1.5 1.1 2.9 1.2 3.1.2.2 2.1 3.2 5.2 4.4.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4z" fill="#fff"/></svg>
                Pesan via WhatsApp
            </a>
        </div>
    `;
}

async function main() {
    const sheet = getQueryParam('p');
    const id = getQueryParam('id');
    if (!sheet || !id) {
        renderProdukDetail(null);
        return;
    }
    const produkList = await fetchProdukData(sheet);
    const produk = produkList.find(p => String(p.id) === String(id));
    renderProdukDetail(produk);
}

document.addEventListener('DOMContentLoaded', main);
