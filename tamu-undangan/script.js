function buatLink() {
    const jenis = document.getElementById('jenis').value;
    const namaInput = document.getElementById('nama').value.trim();
    const pengundang = document.getElementById('pengundang').value.trim();
    const link = document.getElementById('link').value.trim();

    if (!namaInput) return showAlert("Nama tamu tidak boleh kosong","error");

    const namaArray = namaInput.split(',').map(n => n.trim()).filter(n => n);
    if (namaArray.length === 0) return alert("Silakan isi minimal satu nama.");

    let hasilHTML = `
    <table class="w-full text-sm text-left border border-sky-300 bg-white rounded-lg overflow-hidden">
        <thead class="bg-sky-100 text-sky-700">
        <tr>
            <th class="px-4 py-2">Nama Tamu</th>
            <th class="px-4 py-2">Salin</th>
            <th class="px-4 py-2">WhatsApp</th>
        </tr>
        </thead>
        <tbody>
    `;

    namaArray.forEach(nama => {
    const encodedNama = encodeURIComponent(nama.replace(/\s+/g, '_'));
    const linkUndangan = `${link}?to=${encodedNama}`;

    let pesanWA = '';
    if (jenis === 'pernikahan') {
        pesanWA = `Assalamu’alaikum Warahmatullahi Wabarakatuh.%0A%0ADengan memohon rahmat dan ridho Allah SWT, kami mengundang ${nama} untuk menghadiri acara pernikahan kami.%0A%0ALink Undangan:%0A${linkUndangan}%0A%0AMerupakan kehormatan dan kebahagiaan bagi kami apabila berkenan hadir dan memberikan doa restu.%0A%0AWassalamu’alaikum Warahmatullahi Wabarakatuh.%0A%0AHormat kami,%0A${pengundang}`;
    } else {
        pesanWA = `Assalamu’alaikum Warahmatullahi Wabarakatuh.%0A%0ADengan memohon rahmat dan ridho Allah SWT, kami mengundang ${nama} untuk hadir dalam acara tasyakuran khitan anak kami.%0A%0ALink Undangan:%0A${linkUndangan}%0A%0AKehadiran dan doa restu akan menjadi kebahagiaan tersendiri bagi kami.%0A%0AWassalamu’alaikum Warahmatullahi Wabarakatuh.%0A%0AHormat kami,%0A${pengundang}`;
    }

    hasilHTML += `
        <tr class="border-t">
        <td class="px-4 py-2">${nama}</td>
        <td class="px-4 py-2">
            <button onclick="navigator.clipboard.writeText('${linkUndangan}'); showAlert('Link untuk ${nama} berhasil disalin','success','3000')" class="bg-sky-500 hover:bg-sky-600 text-white px-3 py-1 rounded">Salin</button>
        </td>
        <td class="px-4 py-2">
            <a href="https://wa.me/?text=${pesanWA}" target="_blank">
            <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400">Kirim</button>
            </a>
        </td>
        </tr>
    `;
    });

    hasilHTML += '</tbody></table>';
    document.getElementById('hasil').innerHTML = hasilHTML;

    const params = new URLSearchParams({
    jenis,
    nama: namaArray.join(', '),
    link,
    pengundang
    });
    window.history.replaceState({}, '', `${location.pathname}?${params}`);
}

function loadFromURL() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('jenis')) document.getElementById('jenis').value = params.get('jenis');
    if (params.has('nama')) document.getElementById('nama').value = params.get('nama');
    if (params.has('link')) document.getElementById('link').value = params.get('link');
    if (params.has('pengundang')) document.getElementById('pengundang').value = params.get('pengundang');

    if (params.get('jenis') && params.get('nama') && params.get('link') && params.get('pengundang')) {
    buatLink();
    }
}

document.addEventListener("DOMContentLoaded", loadFromURL);