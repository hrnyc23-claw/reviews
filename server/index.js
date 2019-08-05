const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes');

app.use(bodyParser.json());
app.use(morgan('dev'));

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

app.use('/loaderio-e3d06dad53f752b18aa53430b009e7bb', (req, res, next) => {
  res.set(defaultCorsHeaders);
});

app.use('/loaderio-e3d06dad53f752b18aa53430b009e7bb', express.static(path.join(__dirname, 'loaderio-e3d06dad53f752b18aa53430b009e7bb.txt')));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})


