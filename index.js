const express = require('express');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Menyediakan folder 'public' untuk file statis seperti CSS dan Gambar
app.use(express.static(path.join(__dirname, 'public')));

// Konfigurasi koneksi database MySQL menggunakan Environment Variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Endpoint a: Mengembalikan 9 data JSON secara acak dari database
app.get('/api/quotes', (req, res) => {
    const query = 'SELECT id, text, author, created_at FROM quotes ORDER BY RAND() LIMIT 9';
    
    pool.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Gagal mengambil data dari database' });
        }
        res.json(results);
    });
});

// Endpoint b: Mengirimkan halaman web utama (quotes.html) ke browser
app.get('/quotes', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
