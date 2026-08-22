'use strict';

/*
 *
 *  Copyright 2016-2017 Red Hat, Inc, and individual contributors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const logger = require('./logger.js');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const db = require('./lib/db');

const fruits = require('./lib/routes/fruits');

app.use(bodyParser.json());
app.use((error, request, response, next) => {
  if (request.body === '' || (error instanceof SyntaxError && error.type === 'entity.parse.failed')) {
    response.status(415);
    return response.send('Invalid payload!');
  }

  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', fruits);

// Add a health check
app.use('/ready', (request, response) => {
  return response.sendStatus(200);
});

app.use('/live', (request, response) => {
  return response.sendStatus(200);
});

db.init().then(() => {
  logger.info('Database init\'d');
}).catch(error => {
  logger.error(error);
});

module.exports = app;
