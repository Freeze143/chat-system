var express = require('express');
var http = require('http');
const app = express();

var server = http.createServer(app);

app.get('/ver', (req, res) => {
  res.status(200).send("ok")
});



server.listen(3000, () => {
  console.log('Server listening on :3000');
});