var express = require('express');
var http = require('http');
const app = express();

var server = http.createServer(app);

app.get('/ver', (req, res) => {
  res.status(200).send("ok")
});



server.listen(8080, () => {
  console.log('Server listening on :8080');
});