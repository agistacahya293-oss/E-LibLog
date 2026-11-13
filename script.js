// Mengambil data dari LocalStorage saat halaman pertama kali dibuka
let daftarPinjam = JSON.parse(localStorage.getItem('dataPerpustakaan')) || [];

// Menampilkan data ke tabel saat halaman dimuat
document.addEventListener('DOMContentLoaded', tampilkanData);

// Menangani saat formulir disubmit
document.getElementById('form-pinjam').addEventListener('submit', function(e) {
    e.preventDefault();

    const nama = document.getElementById('nama').value;
    const kelas = document.getElementById('kelas').value;
    const judulBuku = document.getElementById('judul-buku').value;

    // Menghitung tanggal hari ini dan tanggal jatuh tempo (+7 hari)
    const hariIni = new Date();
    const jatuhTempo = new Date();
    jatuhTempo.setDate(hariIni.getDate() + 7);

    const formatTanggal = (tgl) => {
        return tgl.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Membuat objek data peminjaman baru
    const dataBaru = {
        id: Date.now(), // ID unik berdasarkan waktu
        nama: nama,
        kelas: kelas,
        judulBuku: judulBuku,
        tglPinjam: formatTanggal(hariIni),
        tglKembali: formatTanggal(jatuhTempo),
        status: 'Dipinjam'
    };

    // Masukkan ke array dan simpan ke LocalStorage
    daftarPinjam.unshift(dataBaru);
    simpanKeStorage();
    tampilkanData();

    // Kosongkan formulir setelah disimpan
    document.getElementById('form-pinjam').reset();
});

// Fungsi menyimpan array ke memori browser (LocalStorage)
function simpanKeStorage() {
    localStorage.setItem('dataPerpustakaan', JSON.stringify(daftarPinjam));
}

// Fungsi menampilkan data ke dalam tabel HTML
function tampilkanData(dataFilter = daftarPinjam) {
    const tbody = document.getElementById('tabel-body');
    tbody.innerHTML = '';

    if (dataFilter.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#888;">Belum ada data peminjaman buku.</td></tr>';
        return;
    }

    dataFilter.forEach((item) => {
        const baris = document.createElement('tr');
        
        const lencanaStatus = item.status === 'Dipinjam' 
            ? `<span class="badge-pinjam">Dipinjam</span>` 
            : `<span class="badge-kembali">Dikembalikan</span>`;

        const tombolAksi = item.status === 'Dipinjam'
            ? `<button class="btn-kembali" onclick="kembalikanBuku(${item.id})">✓ Kembali</button>`
            : `<span style="color:#888; font-size:12px;">Selesai</span>`;

        baris.innerHTML = `
            <td><strong>${item.nama}</strong></td>
            <td>${item.kelas}</td>
            <td>${item.judulBuku}</td>
            <td>${item.tglPinjam}</td>
            <td>${item.tglKembali}</td>
            <td>${lencanaStatus}</td>
            <td>
                ${tombolAksi}
                <button class="btn-hapus" onclick="hapusData(${item.id})" title="Hapus Data">✕</button>
            </td>
        `;
        tbody.appendChild(baris);
    });
}

// Fungsi mengubah status buku menjadi "Dikembalikan"
function kembalikanBuku(id) {
    daftarPinjam = daftarPinjam.map(item => {
        if (item.id === id) {
            item.status = 'Dikembalikan';
        }
        return item;
    });
    simpanKeStorage();
    tampilkanData();
}

// Fungsi menghapus baris data
function hapusData(id) {
    if (confirm('Yakin ingin menghapus riwayat peminjaman ini?')) {
        daftarPinjam = daftarPinjam.filter(item => item.id !== id);
        simpanKeStorage();
        tampilkanData();
    }
}

// Fungsi pencarian nama siswa atau judul buku
function cariData() {
    const kataKunci = document.getElementById('cari-data').value.toLowerCase();
    const hasilFilter = daftarPinjam.filter(item => 
        item.nama.toLowerCase().includes(kataKunci) || 
        item.judulBuku.toLowerCase().includes(kataKunci) ||
        item.kelas.toLowerCase().includes(kataKunci)
    );
    tampilkanData(hasilFilter);
}
