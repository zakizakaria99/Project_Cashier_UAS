// Fungsi untuk memuat riwayat transaksi saat halaman dimuat
function loadTransactionHistory() {
    const riwayatTransaksi = JSON.parse(localStorage.getItem('riwayatTransaksi')) || [];
    const riwayatTransaksiElement = document.getElementById('riwayatTransaksi');

    if (riwayatTransaksi.length > 0) {
        riwayatTransaksiElement.innerHTML = ''; // Membersihkan konten sebelum menambahkan riwayat transaksi

        riwayatTransaksi.forEach((transaksi, index) => {
            const table = document.createElement('table');
            table.classList.add('transaction-table');
            table.innerHTML = `
                <caption>Transaksi ${index + 1}</caption>
                <thead>
                    <tr>
                        <th>Nama Barang</th>
                        <th>Harga</th>
                        <th>Jumlah</th>
                        <th>Total Harga</th>
                    </tr>
                </thead>
                <tbody>
                    ${transaksi.transaksi.map(item => `
                        <tr>
                            <td>${item.nama}</td>
                            <td>${item.harga}</td>
                            <td>${item.jumlah}</td>
                            <td>${item.total}</td>
                        </tr>`).join('')}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3"><strong>Total Harga:</strong></td>
                        <td>${transaksi.totalHarga}</td>
                    </tr>
                    <tr>
                        <td colspan="3"><strong>Uang Dibayarkan:</strong></td>
                        <td>${transaksi.uangDibayarkan}<td>
                    </tr>
                    <tr>
                        <td colspan="3"><strong>Kembalian:</strong></td>
                        <td>${transaksi.kembalian}</td>
                    </tr>
                </tfoot>
            `;
            riwayatTransaksiElement.appendChild(table);
        });
    } else {
        riwayatTransaksiElement.innerHTML = '<p>Tidak ada riwayat transaksi.</p>';
    }
}

// Panggil fungsi untuk memuat riwayat transaksi saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadTransactionHistory);

// Fungsi untuk mendapatkan tanggal saat ini dalam format YYYY-MM-DD
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

document.addEventListener('DOMContentLoaded', function() {
    // Ambil tanggal terakhir riwayat transaksi dari localStorage
    const lastTransactionDate = localStorage.getItem('lastTransactionDate');
    
    // Periksa apakah tanggal terakhir riwayat transaksi sama dengan tanggal hari ini
    const currentDate = getCurrentDate();
    if (lastTransactionDate !== currentDate) {
        // Jika tanggal berbeda, hapus riwayat transaksi dari localStorage
        localStorage.removeItem('riwayatTransaksi');
        
        // Simpan tanggal hari ini sebagai tanggal terakhir riwayat transaksi
        localStorage.setItem('lastTransactionDate', currentDate);
        
        // Muat ulang halaman untuk meresetnya ke default
        location.reload();
    }
});

// Fungsi untuk mendapatkan tanggal saat ini dalam format YYYY-MM-DD
function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
