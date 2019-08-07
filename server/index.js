const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes');
const path = require('path');

app.use(bodyParser.json());
// app.use(morgan('dev'));

const port = 3000;

const defaultCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10
};

app.use('/reviews', (req, res, next) => {
  res.set(defaultCorsHeaders);
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use('/reviews', router);

app.all('/interactions', (req, res) => {
  res.set(defaultCorsHeaders);
  res.sendStatus(201);
});

app.get('/lloaderio-c0f68774e41bbc00a0eb6848768034fd', (req, res) => {
  res.set(defaultCorsHeaders);
  res.sendFile(path.join(__dirname, 'lloaderio-c0f68774e41bbc00a0eb6848768034fd.txt'));
});

app.get('/health', (req, res) => {
  res.set(defaultCorsHeaders);
  res.send(200);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})


