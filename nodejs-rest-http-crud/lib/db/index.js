'use strict';

const logger = require('../../logger.js');

const serviceBindings = require('kube-service-bindings');
const { Pool } = require('pg');

let connectionOptions;
try {
  connectionOptions = serviceBindings.getBinding('POSTGRESQL', 'pg');
} catch (err) {
  const serviceHost = process.env.MY_DATABASE_SERVICE_HOST || process.env.POSTGRESQL_SERVICE_HOST || 'localhost';
  const user = process.env.DB_USERNAME || process.env.POSTGRESQL_USER || 'luke';
  const password = process.env.DB_PASSWORD || process.env.POSTGRESQL_PASSWORD || 'secret';
  const databaseName = process.env.POSTGRESQL_DATABASE || 'my_data';
  const connectionString = `postgresql://${user}:${password}@${serviceHost}:5432/${databaseName}`;
  connectionOptions = { connectionString };
}

const pool = new Pool(connectionOptions);

async function didInitHappen () {
  const query = 'select * from products';

  try {
    await pool.query(query);
    logger.info('Database Already Created');
    return true;
  } catch (err) {
    return false;
  }
}

// -- Create the products table if not present
const initScript = `CREATE TABLE IF NOT EXISTS products (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(40) NOT NULL,
  stock     BIGINT
);

DELETE FROM products;

INSERT INTO products (name, stock) values ('Apple', 10);
INSERT INTO products (name, stock) values ('Orange', 10);
INSERT INTO products (name, stock) values ('Pear', 10);`;

async function query (text, parameters) {
  // Check that we have initialized the DB on each Query request
  const initHappened = await didInitHappen();
  if (!initHappened) {
    await init();
  }

  return pool.query(text, parameters);
}

async function init () {
  const initHappened = await didInitHappen();
  if (!initHappened) {
    return pool.query(initScript);
  }
}

module.exports = {
  query,
  init
};
