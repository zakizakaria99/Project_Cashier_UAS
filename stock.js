// Fungsi untuk menambahkan barang baru ke daftar stok
function tambahBarang(event) {
    event.preventDefault(); // Jangan lupa untuk mencegah aksi bawaan form
    
    const namaBarang = document.getElementById('namaBarang').value;
    const hargaBarang = parseFloat(document.getElementById('hargaBarang').value);
    const jenisBarang = document.getElementById('jenisBarang').value;
    const stockBarang = parseInt(document.getElementById('stockBarang').value);

    if (namaBarang && !isNaN(hargaBarang) && jenisBarang && !isNaN(stockBarang)) {
        const item = {
            id: Date.now(), // Menambahkan ID unik untuk setiap item
            nama: namaBarang,
            harga: hargaBarang,
            jenis: jenisBarang,
            stock: stockBarang
        };

        let stock = JSON.parse(localStorage.getItem('stock')) || [];
        stock.push(item);
        localStorage.setItem('stock', JSON.stringify(stock));

        renderStockList();
        alert('Barang telah ditambahkan ke stock.');

        // Reset form ke keadaan default
        document.getElementById('stockForm').reset();
    } else {
        alert('Mohon lengkapi informasi barang.');
    }
}

// Fungsi untuk merender daftar stok ke dalam HTML
function renderStockList() {
    const stockListElement = document.getElementById('stockList');
    stockListElement.innerHTML = '';

    const stock = JSON.parse(localStorage.getItem('stock')) || [];
    const groupedStock = groupStockByType(stock); // Panggil fungsi untuk mengelompokkan stok berdasarkan jenisnya

    // Iterasi melalui setiap jenis barang (makanan dan minuman)
    Object.keys(groupedStock).forEach(jenis => {
        const jenisStock = groupedStock[jenis];
        const jenisHeader = document.createElement('h3');
        jenisHeader.textContent = jenis.charAt(0).toUpperCase() + jenis.slice(1); // Membuat judul jenis barang dengan huruf kapital pertama
        stockListElement.appendChild(jenisHeader);

        // Membuat tabel untuk jenis barang ini
        const table = document.createElement('table');
        table.classList.add('stock-table');
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Nama</th>
                <th>Harga</th>
                <th>Stock</th>
                <th>Aksi</th>
            </tr>
        `;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        jenisStock.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.nama}</td>
                <td>${item.harga}</td>
                <td>${item.stock}</td>
                <td>
                    <button onclick="editHarga(${item.id})">Edit Harga</button>
                    <button onclick="editStock(${item.id})">Edit Stock</button>
                    <button onclick="hapusBarang(${item.id})">Hapus</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        stockListElement.appendChild(table);
    });
}

// Fungsi untuk mengelompokkan stok berdasarkan jenisnya
function groupStockByType(stock) {
    return stock.reduce((groupedStock, item) => {
        // Jika jenis barang belum ada dalam objek groupedStock, buat array kosong untuk jenis tersebut
        if (!groupedStock[item.jenis]) {
            groupedStock[item.jenis] = [];
        }
        // Masukkan barang ke dalam array sesuai jenisnya
        groupedStock[item.jenis].push(item);
        return groupedStock;
    }, {});
}

// Fungsi untuk menghapus barang dari daftar stok
function hapusBarang(id) {
    let stock = JSON.parse(localStorage.getItem('stock')) || [];
    stock = stock.filter(item => item.id !== id);
    localStorage.setItem('stock', JSON.stringify(stock));

    renderStockList();
}

// Fungsi untuk menangani edit harga barang di daftar stok
function editHarga(id) {
    let stock = JSON.parse(localStorage.getItem('stock')) || [];
    const hargaBaru = parseFloat(prompt('Masukkan harga baru:'));

    if (!isNaN(hargaBaru)) {
        stock = stock.map(item => {
            if (item.id === id) {
                item.harga = hargaBaru;
            }
            return item;
        });
        localStorage.setItem('stock', JSON.stringify(stock));
        renderStockList();
    } else {
        alert('Mohon masukkan angka yang valid.');
    }
}

// Fungsi untuk menangani edit stok barang di daftar stok
function editStock(id) {
    let stock = JSON.parse(localStorage.getItem('stock')) || [];
    const stokBaru = parseInt(prompt('Masukkan stok baru:'));

    if (!isNaN(stokBaru)) {
        stock = stock.map(item => {
            if (item.id === id) {
                item.stock += stokBaru; // Menambahkan stok baru ke stok yang ada
            }
            return item;
        });
        localStorage.setItem('stock', JSON.stringify(stock));
        renderStockList();
    } else {
        alert('Mohon masukkan angka yang valid.');
    }
}


// Panggil fungsi untuk merender daftar stok saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderStockList);

// Tambahkan event listener untuk form
document.getElementById('stockForm').addEventListener('submit', tambahBarang);
