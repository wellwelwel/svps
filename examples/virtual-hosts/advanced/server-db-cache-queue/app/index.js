import http from 'http';

const server = http.createServer((_, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('🚀');
});

server.listen(3000);
