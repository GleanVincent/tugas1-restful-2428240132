const express = require("express");
const app = express();
const PORT = 3000;

// Middleware agar req.body (JSON) dapat dibaca
app.use(express.json());

// Data sementara (disimpan di memori, hilang saat server restart)
let apotek = [
  {
    id: 1,
    namaObat: "Paracetamol 500 mg",
    jenis: "tablet",
    harga: 12000,
    stok: 150,
    tanggalKedaluwarsa: "2028-03-31",
  },
  {
    id: 2,
    namaObat: "Ibuprofen 400 mg",
    jenis: "tablet",
    harga: 15000,
    stok: 100,
    tanggalKedaluwarsa: "2028-06-30",
  },
];

let nextId = 3; // penghitung id untuk data baru

// GET /apotek -> seluruh data, bisa difilter: /apotek?jenis=tablet
app.get("/apotek", (req, res) => {
  const { jenis } = req.query;

  if (jenis) {
    const hasil = apotek.filter((m) => m.jenis === jenis);
    return res.json(hasil);
  }

  res.json(apotek);
});

// POST /apotek
// Body: { "namaObat": "Paracetamol 500 mg", "jenis": "tablet", "harga": 12000, "stok": 150, "tanggalKedaluwarsa": "2028-03-31" }
app.post("/apotek", (req, res) => {
  const { namaObat, jenis, harga, stok, tanggalKedaluwarsa } = req.body;

  if (!namaObat || !jenis || !harga || !stok || !tanggalKedaluwarsa) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  const baru = {
    id: nextId++,
    namaObat,
    jenis,
    harga,
    stok,
    tanggalKedaluwarsa,
  };

  apotek.push(baru);
  res.status(201).json(baru);
});

// PUT /apotek/2
// Body: { "namaObat": "Paracetamol 500 mg", "jenis": "tablet", "harga": 12000, "stok": 150, "tanggalKedaluwarsa": "2028-03-31" }
app.put("/apotek/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = apotek.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }

  apotek[index] = { ...apotek[index], ...req.body, id };
  res.json(apotek[index]);
});

// DELETE /apotek/2
app.delete("/apotek/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = apotek.findIndex((m) => m.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Data tidak ditemukan" });
  }

  apotek.splice(index, 1);
  res.status(204).send();
});

app.get("/", (req, res) => {
  res.send("Server Express.js berjalan!");
});

// GET /apotek -> menampilkan seluruh data
app.get("/apotek", (req, res) => {
  res.json(apotek);
});

// GET /apotek/:id -> menampilkan satu data berdasarkan id
app.get("/apotek/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = apotek.find((m) => m.id === id);

  if (!data) return res.status(404).json({ message: "Data tidak ditemukan" });
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
