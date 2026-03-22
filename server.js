const jsonServer = require('json-server');
const fs = require('fs');
const path = require('path');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Магия для Vercel: копируем базу в /tmp, чтобы json-server не ругался на read-only
const dbPath = path.join(__dirname, 'db.json');
const tempDbPath = path.join('/tmp', 'db.json');

if (!fs.existsSync(tempDbPath)) {
  fs.writeFileSync(tempDbPath, fs.readFileSync(dbPath));
}

const router = jsonServer.router(tempDbPath);

server.use(middlewares);
server.use(jsonServer.rewriter({
  "/api/*": "/$1"
}));
server.use(router);

module.exports = server;const jsonServer = require('json-server');
const server = jsonServer.create();
const middlewares = jsonServer.defaults();
// Прямо указываем путь к базе
const router = jsonServer.router('db.json');

server.use(middlewares);
// Магия для Vercel, чтобы он не искал статику
server.use(jsonServer.rewriter({
  "/api/*": "/$1"
}));
server.use(router);

// Экспортируем для Vercel
module.exports = server;
