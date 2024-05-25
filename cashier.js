let transaksi = [];
let totalHarga = 0;

// Fungsi untuk mendapatkan tanggal saat ini dalam format YYYY-MM-DD
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Fungsi untuk memperbarui harga berdasarkan nama barang
function updateHarga() {
    const namaBarang = document.getElementById('namaBarang').value;
    const stock = JSON.parse(localStorage.getItem('stock')) || [];
    const item = stock.find(item => item.nama.toLowerCase() === namaBarang.toLowerCase());
    
    if (item) {
        document.getElementById('hargaBarang').value = item.harga;
    } else {
        document.getElementById('hargaBarang').value = '';
    }
}

// Fungsi untuk menambahkan barang ke daftar transaksi
function tambahBarang() {
    const namaBarang = document.getElementById('namaBarang').value;
    const hargaBarang = parseFloat(document.getElementById('hargaBarang').value);
    const jumlahBarang = parseInt(document.getElementById('jumlahBarang').value);

    if (namaBarang && !isNaN(hargaBarang) && !isNaN(jumlahBarang)) {
        const item = {
            id: Date.now(),
            nama: namaBarang,
            harga: hargaBarang,
            jumlah: jumlahBarang,
            total: hargaBarang * jumlahBarang
        };

        transaksi.push(item);
        totalHarga += item.total;

        renderTransactionList();
        document.getElementById('total').innerText = totalHarga;

        // Reset input fields
        document.getElementById('namaBarang').value = '';
        document.getElementById('hargaBarang').value = '';
        document.getElementById('jumlahBarang').value = '';
    } else {
        alert('Mohon lengkapi informasi barang.');
    }
}

// Fungsi untuk merender daftar transaksi ke dalam HTML
function renderTransactionList() {
    const transactionListElement = document.getElementById('transactionList').getElementsByTagName('tbody')[0];
    transactionListElement.innerHTML = '';

    transaksi.forEach((item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nama}</td>
            <td>${item.harga}</td>
            <td>${item.jumlah}</td>
            <td>${item.total}</td>
            <td>
                <button onclick="editJumlah(${item.id})">Edit Jumlah</button>
                <button onclick="hapusBarang(${item.id})">Hapus</button>
            </td>
        `;
        transactionListElement.appendChild(tr);
    });
}

// Fungsi untuk menghitung kembalian
function hitungKembalian() {
    const uangDibayarkan = parseFloat(document.getElementById('uangDibayarkan').value);
    const kembalian = uangDibayarkan - totalHarga;
    
    if (!isNaN(kembalian)) {
        document.getElementById('kembalian').innerText = kembalian;
    } else {
        alert('Mohon masukkan jumlah uang yang valid.');
    }
}

// Fungsi untuk menyimpan transaksi ke dalam localStorage dan mengurangi stok barang
function simpanTransaksi() {
    const uangDibayarkan = parseFloat(document.getElementById('uangDibayarkan').value);
    if (transaksi.length > 0 && !isNaN(uangDibayarkan)) {
        const waktuTransaksi = new Date(); // Tambahkan waktu transaksi saat ini
        let riwayatTransaksi = JSON.parse(localStorage.getItem('riwayatTransaksi')) || [];
        riwayatTransaksi.push({
            transaksi: transaksi,
            totalHarga: totalHarga,
            uangDibayarkan: uangDibayarkan,
            kembalian: parseFloat(document.getElementById('kembalian').innerText),
            waktu: waktuTransaksi.toLocaleString(), // Konversi waktu ke format lokal yang sesuai
        });

        localStorage.setItem('riwayatTransaksi', JSON.stringify(riwayatTransaksi));

        // Update stock items
        let stock = JSON.parse(localStorage.getItem('stock')) || [];
        transaksi.forEach(item => {
            const stockItemIndex = stock.findIndex(stockItem => stockItem.nama === item.nama);
            if (stockItemIndex !== -1) {
                stock[stockItemIndex].stock -= item.jumlah;
            }
        });
        localStorage.setItem('stock', JSON.stringify(stock));

        alert('Transaksi telah disimpan.');

        // Reset transaksi
        transaksi = [];
        totalHarga = 0;
        renderTransactionList();
        document.getElementById('total').innerText = totalHarga;
        document.getElementById('kembalian').innerText = '';
        document.getElementById('uangDibayarkan').value = '';
    } else {
        alert('Mohon masukkan jumlah uang yang valid.');
    }
}

        
        // Fungsi untuk menghapus barang dari daftar transaksi
        function hapusBarang(id) {
            const itemIndex = transaksi.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                totalHarga -= transaksi[itemIndex].total;
                transaksi.splice(itemIndex, 1);
                renderTransactionList();
                document.getElementById('total').innerText = totalHarga;
            }
        }
        
        // Fungsi untuk mengedit jumlah barang dalam daftar transaksi
        function editJumlah(id) {
            const itemIndex = transaksi.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                const newJumlah = prompt('Masukkan jumlah baru:', transaksi[itemIndex].jumlah);
                if (newJumlah !== null && !isNaN(newJumlah)) {
                    const item = transaksi[itemIndex];
                    totalHarga -= item.total;
                    item.jumlah = parseInt(newJumlah);
                    item.total = item.harga * item.jumlah;
                    totalHarga += item.total;
                    renderTransactionList();
                    document.getElementById('total').innerText = totalHarga;
                }
            }
        }
        
        // Fungsi untuk membuat dan mengunduh file riwayat transaksi
        function downloadRiwayatTransaksi() {
            // Ambil riwayat transaksi dari localStorage
            const riwayatTransaksi = JSON.parse(localStorage.getItem('riwayatTransaksi')) || [];
            
            // Buat konten file menggunakan format yang diinginkan, misalnya JSON
            const jsonData = JSON.stringify(riwayatTransaksi, null, 2);
            
            // Buat objek blob dari konten file
            const blob = new Blob([jsonData], { type: 'application/json' });
            
            // Buat URL objek blob
            const url = URL.createObjectURL(blob);
            
            // Buat elemen <a> untuk tautan unduhan
            const a = document.createElement('a');
            a.href = url;
            a.download = 'riwayat_transaksi.json'; // Nama file yang akan diunduh
            a.click(); // Klik tautan secara otomatis
            
            // Hapus URL objek blob setelah pengunduhan
            URL.revokeObjectURL(url);
        }
        
        // Tambahkan event listener ke tombol atau tautan unduh
        document.getElementById('downloadButton').addEventListener('click', downloadRiwayatTransaksi);
        
        // Panggil fungsi untuk merender daftar transaksi saat halaman dimuat
        document.addEventListener('DOMContentLoaded', renderTransactionList);

        // Fungsi untuk mereset transaksi jika hari berubah
function resetTransaksiJikaHariBerubah() {
    const currentDate = getCurrentDate();
    const lastTransactionDate = localStorage.getItem('lastTransactionDate');

    if (lastTransactionDate !== currentDate) {
        // Reset transaksi dan total harga
        transaksi = [];
        totalHarga = 0;
        renderTransactionList();
        document.getElementById('total').innerText = totalHarga;

        // Simpan tanggal transaksi terakhir ke dalam localStorage
        localStorage.setItem('lastTransactionDate', currentDate);
    }
}

// Panggil fungsi untuk mereset transaksi saat halaman dimuat
document.addEventListener('DOMContentLoaded', resetTransaksiJikaHariBerubah);

        