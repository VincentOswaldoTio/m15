const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// 1. Inisialisasi Koneksi Sequelize menggunakan Public URL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql', //
    logging: false,    // Ubah jadi true jika ingin melihat query SQL mentah di terminal
    dialectOptions: {
        connectTimeout: 60000 // Mencegah kegagalan koneksi jika jaringan lambat
    }
});

// 2. Definisikan Model 'Quote' agar sesuai dengan tabel quotes Anda
const Quote = sequelize.define('Quote', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'quotes', // Memaksa sequelize menggunakan nama tabel asli dari database
    timestamps: false    // Matikan jika Anda tidak menggunakan kolom bawaan updatedAt dan createdAt default Sequelize
});

// Tes koneksi database saat server dinyalakan
sequelize.authenticate()
    .then(() => console.log('Koneksi Sequelize berhasil terhubung ke MySQL Railway.'))
    .catch(err => console.error('Gagal terhubung ke database:', err));

// Endpoint a: Mengembalikan 9 data JSON secara acak
app.get('/api/quotes', async (req, res) => {
    try {
        const randomQuotes = await Quote.findAll({
            order: sequelize.random(), // Fungsi SQL RAND() versi Sequelize
            limit: 9
        });
        res.json(randomQuotes);
    } catch (err) {
        console.error('Error Sequelize pada /api/quotes:', err);
        res.status(500).json({ error: 'Gagal mengambil data dari database' });
    }
});

// Endpoint b: Mengirimkan halaman web utama (quotes.html)
app.get('/quotes', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'quotes.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
