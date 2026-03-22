const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, 'db.json');
const ADMIN_DB_PATH = path.join(__dirname, 'admin.json');

app.use(cors());
app.use(express.json());

if (!fs.existsSync(ADMIN_DB_PATH)) {
    fs.writeFileSync(ADMIN_DB_PATH, JSON.stringify({ pinHash: "" }));
}

const hashData = (data) => crypto.createHash('sha256').update(data).digest('hex');

app.post('/admin/setup', (req, res) => {
    const { pin } = req.body;
    if (!pin || pin.length < 4) return res.status(400).json({ message: "Минимум 4 символа" });
    const pinHash = hashData(pin);
    fs.writeFileSync(ADMIN_DB_PATH, JSON.stringify({ pinHash }));
    console.log("[SECURITY]: Смена мастер-ключа администратора");
    res.json({ success: true });
});

app.post('/admin/verify', (req, res) => {
    const { pin } = req.body;
    const adminData = JSON.parse(fs.readFileSync(ADMIN_DB_PATH, 'utf8'));
    if (adminData.pinHash === hashData(pin)) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
});

app.get('/users', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    res.json(data.users || []);
});

app.get('/users/:id', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const user = db.users.find(u => u.id === parseInt(req.params.id));
    user ? res.json(user) : res.status(404).send("Не найден");
});

app.post('/users', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const newUser = { ...req.body, id: Date.now(), createdAt: new Date().toISOString() };
    if (newUser.password) newUser.password = hashData(newUser.password);
    db.users.push(newUser);
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.json(newUser);
});

app.put('/users/:id', (req, res) => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    const id = parseInt(req.params.id);
    const idx = db.users.findIndex(u => u.id === id);
    if (idx !== -1) {
        if (req.body.password) req.body.password = hashData(req.body.password);
        else req.body.password = db.users[idx].password;
        db.users[idx] = { ...db.users[idx], ...req.body, id };
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
        res.json(db.users[idx]);
    } else res.status(404).send("Не найден");
});

app.delete('/users/:id', (req, res) => {
    let db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    db.users = db.users.filter(u => u.id !== parseInt(req.params.id));
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    res.status(204).send();
});

app.listen(PORT, () => console.log(`Security Server on port ${PORT}`));
