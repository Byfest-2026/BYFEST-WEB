require('dotenv').config();
const express = require('express');
const db = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API Byfest 2026 berjalan dengan baik!');
});

app.listen(port, () => {
    console.log(`[zahwan] Peladen backend sukses menyala dan bersiap di port ${port}`);
});