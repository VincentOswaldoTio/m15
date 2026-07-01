const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Menyediakan akses folder statis public
app.use(express.static(path.join(__dirname, 'public')));

// 1. Inisialisasi Koneksi Sequelize
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        connectTimeout: 60000
    }
});

// 2. Definisikan Model 'Quote'
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
    tableName: 'quotes',
    timestamps: false
});

// Cek Koneksi Database
sequelize.authenticate()
    .then(() => console.log('Koneksi Sequelize berhasil terhubung ke MySQL Railway.'))
    .catch(err => console.error('Gagal terhubung ke database:', err));

// Endpoint Halaman Utama (Mencegah Cannot GET /)
app.get('/', (req, res) => {
    res.redirect('/quotes');
});

// Endpoint API JSON
app.get('/api/quotes', async (req, res) => {
    try {
        const randomQuotes = await Quote.findAll({
            order: sequelize.random(),
            limit: 9
        });
        res.json(randomQuotes);
    } catch (err) {
        console.error('Error Sequelize pada /api/quotes:', err);
        res.status(500).json({ error: 'Gagal mengambil data dari database' });
    }
});

// Endpoint Tampilan Web Utama
app.get('/quotes', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'quotes.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
