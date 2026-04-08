const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const cors = require('cors');

server.use(cors()); // Разрешаем запросы со всех доменов
server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/admin/verify', (req, res) => {
  const { pin } = req.body;
  res.json({ success: pin === '1234' });
});

server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend is running on port ${PORT}`);
});
