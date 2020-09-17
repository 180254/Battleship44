'use strict';

const express = require('express');
const serveStatic = require('serve-static');

const app = express();
app.use(serveStatic('static', {index: ['index.html']}));

const port = process.argv[2] || 8090;
app.listen(port, () => {
  console.log('live at port ' + port);
});

module.exports = app;
