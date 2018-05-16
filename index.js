'use strict';

const express = require('express'),
bodyParser = require('body-parser'),
morgan = require('morgan'),
db = require('./server/config/db.js'),
env = require('./server/config/env'),
router = require('./server/router/index');

const app = express();
const PORT = env.PORT;

app.use(morgan('combined'));
app.use(bodyParser.json());


router(app, db);
app.use(express.static('public'))

//drop and resync with { force: true }
db.connection.sync().then(() => {
  app.listen(PORT, () => {
    console.log('Express listening on port:', PORT);
  });
});
