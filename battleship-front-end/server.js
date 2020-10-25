'use strict';

const SERVE_PRE_COMPRESSED_FILES = false;

const express = require('express');
const morgan = require('morgan');

const app = express();
app.disable('x-powered-by');
app.use(morgan('dev'));

if (SERVE_PRE_COMPRESSED_FILES) {
  const expressStaticGzip = require('express-static-gzip');
  app.use(
    '/',
    expressStaticGzip('dist', {
      enableBrotli: true,
      orderPreference: ['br', 'gz'],
    })
  );
} else {
  const serveStatic = require('serve-static');
  app.use(serveStatic('dist'));
}

const port = process.argv[2] || 8090;
app.listen(port, () => {
  console.log('live at port ' + port);
});

module.exports = app;
