/* eslint-disable no-undef */
'use strict';

const assert = require('assert');
const proxyquire = require('proxyquire');

const mockDb = {
  query: () => {
    return Promise.resolve();
  }
};

const fruits = proxyquire('../lib/api/fruits', {
  '../db': mockDb
});

describe('Fruits methods', () => {
  it('API', () => {
    assert.strictEqual(typeof fruits.find, 'function');
    assert.strictEqual(typeof fruits.findAll, 'function');
    assert.strictEqual(typeof fruits.create, 'function');
    assert.strictEqual(typeof fruits.update, 'function');
    assert.strictEqual(typeof fruits.remove, 'function');
  });

  it('find all', () => {
    const result = fruits.findAll();
    assert.strictEqual(result instanceof Promise, true);
  });

  it('find', () => {
    const result = fruits.find('id');
    assert.strictEqual(result instanceof Promise, true);
  });

  it('create', () => {
    const result = fruits.create('name', 'stock');
    assert.strictEqual(result instanceof Promise, true);
  });

  it('update', () => {
    const result = fruits.update({ name: 'name', stock: 'stock', id: 1 });
    assert.strictEqual(result instanceof Promise, true);
  });

  it('remove', () => {
    const result = fruits.remove('id');
    assert.strictEqual(result instanceof Promise, true);
  });
});
