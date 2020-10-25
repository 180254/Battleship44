'use strict';

const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const morgan = require('morgan');

const app = express();
app.disable('x-powered-by');
app.use(morgan('dev', {}));

app.use(
  '/',
  expressStaticGzip('dist', {
    enableBrotli: true,
    orderPreference: ['br', 'gz'],
  })
);

const port = process.argv[2] || 8090;
app.listen(port, () => {
  console.log('live at port ' + port);
});

module.exports = app;
