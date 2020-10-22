'use strict';

const express = require('express');
const serveStatic = require('serve-static');
const morgan = require('morgan');

const app = express();
app.disable('x-powered-by');
app.use(morgan('dev', {}));
app.use(serveStatic('dist'));

const port = process.argv[2] || 8090;
app.listen(port, () => {
  console.log('live at port ' + port);
});

module.exports = app;
