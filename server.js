const jsonServer = require('json-server');
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
