
import http from 'http';
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Node native server OK');
});
server.listen(5999, () => {
  console.log('🚀 Native node server running on 5999');
});
