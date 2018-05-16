'use strict';

const express = require('express'),
bodyParser = require('body-parser'),
morgan = require('morgan'),
db = require('./server/config/db.js'),
env = require('./server/config/env'),
router = require('./server/router/index'),
fileUpload = require('express-fileupload');

const app = express();
const PORT = env.PORT;

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(fileUpload());

router(app, db);
app.use(express.static('public'))

//drop and resync with { force: true }
db.connection.sync().then(() => {
  app.listen(PORT, () => {
    console.log('Express listening on port:', PORT);
  });
});
