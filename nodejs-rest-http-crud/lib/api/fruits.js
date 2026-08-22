'use strict';

const db = require('../db');

function find (id) {
  return db.query('SELECT * FROM products WHERE id = $1', [id]);
}

function findAll () {
  return db.query('SELECT * FROM products');
}

function create (name, stock) {
  return db.query('INSERT INTO products (name, stock) VALUES ($1, $2) RETURNING *', [name, stock]);
}

function update (options = {}) {
  return db.query('UPDATE products SET name = $1, stock = $2 WHERE id = $3', [options.name, options.stock, options.id]);
}

function remove (id) {
  return db.query('DELETE FROM products WHERE id = $1', [id]);
}

module.exports = {
  find,
  findAll,
  create,
  update,
  remove
};
