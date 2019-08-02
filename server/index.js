const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('./routes');

app.use(bodyParser.json());
app.use(morgan('dev'));

const port = 80;

const defaultCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10
};

app.all('/reviews', (req, res, next) => {
  console.log(req.path)
  res.set(defaultCorsHeaders);
  next();
});

app.use('/reviews', router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})


