const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.rewriter({
  "/api/*": "/$1"
}));
server.use(router);

if (process.env.NODE_ENV !== 'production') {
  server.listen(3001, () => {
    console.log('JSON Server is running');
  });
}

module.exports = server;const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);
server.listen(3001, '0.0.0.0', () => {
  console.log('JSON Server is running on http://193.42.115.90:3001');
});
module.exports = server;
