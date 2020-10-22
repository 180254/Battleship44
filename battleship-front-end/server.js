'use strict';

const express = require('express');
const morgan = require('morgan');

const app = express();
app.disable('x-powered-by');
app.use(morgan('dev', {}));
app.use('/', express.static('src'));
app.use('/dist', express.static('dist'));
const port = process.argv[2] || 8090;
app.listen(port, () => {
  console.log('live at port ' + port);
});

module.exports = app;
