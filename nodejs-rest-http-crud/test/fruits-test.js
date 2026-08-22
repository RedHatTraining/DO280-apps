/* eslint-disable no-undef */
'use strict';

const assert = require('assert');
const supertest = require('supertest');
const proxyquire = require('proxyquire');

const mockDb = {
  init: () => {
    return Promise.resolve();
  }
};

describe('Fruits', () => {
  it('get all', async () => {
    const mockApi = {
      findAll: () => Promise.resolve({ rows: [{ id: 1 }] })
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const { body } = await supertest(app)
      .get('/api/fruits')
      .expect('Content-Type', /json/)
      .expect(200);

    assert.strictEqual(Array.isArray(body), true);
    assert.strictEqual(body.length, 1);
  });

  it('get all error', async () => {
    const mockApi = {
      findAll: () => Promise.reject(new Error('error'))
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .get('/api/fruits')
      .expect(400);

    assert.strictEqual(response.statusCode, 400);
  });

  it('get one', async () => {
    const mockApi = {
      find: id => {
        assert.strictEqual(id, '1');
        return Promise.resolve({ rows: [{ id }] });
      }
    };
    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });
    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });
    const { body } = await supertest(app)
      .get('/api/fruits/1')
      .expect('Content-Type', /json/)
      .expect(200);
    assert.strictEqual(Array.isArray(body), false);
    assert.strictEqual(body.id, '1');
  });

  it('get one - return 404', async () => {
    const mockApi = {
      find: () => Promise.resolve({ rowCount: 0 })
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });
    const response = await supertest(app)
      .get('/api/fruits/1')
      .expect(404);
    assert.strictEqual(response.text, 'Item 1 not found');
  });

  it('get one - error', async () => {
    const mockApi = {
      find: () => Promise.reject(new Error('error'))
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .get('/api/fruits/1')
      .expect(400);
    assert.strictEqual(response.statusCode, 400);
  });

  it('post', async () => {
    const fruitData = {
      name: 'Banana',
      stock: 10
    };

    const mockApi = {
      create: (name, stock) => {
        assert.strictEqual(name, fruitData.name);
        assert.strictEqual(stock, fruitData.stock);
        return Promise.resolve({ rows: [] });
      }
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .send(fruitData)
      .expect(201);
    assert.strictEqual(response.statusCode, 201);
  });

  it('post - error - no name', async () => {
    const fruitData = {
      stock: 10
    };

    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .send(fruitData)
      .expect(422);
    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'The name is required!');
  });

  it('post - error - no stock', async () => {
    const fruitData = {
      name: 'Banana'
    };

    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .send(fruitData)
      .expect(422);
    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'The stock must be greater or equal to 0!');
  });

  it('post - error - id error', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .send({ name: 'Banana', stock: 10, id: 22 })
      .expect(422);

    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'Id was invalidly set on request.');
  });

  it('post - error', async () => {
    const fruitData = {
      name: 'Banana',
      stock: 10
    };

    const mockApi = {
      create: () => {
        return Promise.reject(new Error('error'));
      }
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .send(fruitData)
      .expect(400);

    assert.strictEqual(response.statusCode, 400);
  });

  it('post - error - id error', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .send({ name: 'Banana', stock: 10, id: 22 })
      .expect(422);

    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'Id was invalidly set on request.');
  });

  it('post - error - no payload', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .expect(415);

    assert.strictEqual(response.statusCode, 415);
    assert.strictEqual(response.text, 'Invalid payload!');
  });

  it('post - error - invalid payload', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .set('Content-Type', 'application/json')
      .send('Some text')
      .expect(415);

    assert.strictEqual(response.statusCode, 415);
    assert.strictEqual(response.text, 'Invalid payload!');
  });

  it('post - error - xml payload', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });
    const xmlFruitData = '<?xml version="1.0" encoding="UTF-8"?><fruit><name>Banana</name><stock>10</stock></fruit>';

    const response = await supertest(app)
      .post('/api/fruits')
      .set('Content-Type', 'application/xml')
      .send(xmlFruitData)
      .expect(415);

    assert.strictEqual(response.statusCode, 415);
    assert.strictEqual(response.text, 'Invalid payload!');
  });

  it('post - error - JSON Content-Type and XML body', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });
    const xmlFruitData = '<?xml version="1.0" encoding="UTF-8"?><fruit><name>adam</name><stock>10</stock></fruit>';

    const response = await supertest(app)
      .post('/api/fruits')
      .set('Content-Type', 'application/json')
      .send(xmlFruitData)
      .expect(415);

    assert.strictEqual(response.statusCode, 415);
    assert.strictEqual(response.text, 'Invalid payload!');
  });

  it('post - error - negative number of stock', async () => {
    const fruitData = {
      name: 'Banana',
      stock: -10
    };

    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .send(fruitData)
      .expect(422);

    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'The stock must be greater or equal to 0!');
  });

  it('post - error - no numeric stock', async () => {
    const fruitData = {
      name: 'Banana',
      stock: 'two'
    };

    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .post('/api/fruits')
      .send(fruitData)
      .expect(422);

    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'The stock must be greater or equal to 0!');
  });

  it('put', async () => {
    const fruitData = {
      name: 'Banana',
      stock: 10,
      id: '20'
    };

    const mockApi = {
      update: options => {
        assert.strictEqual(options.name, fruitData.name);
        assert.strictEqual(options.stock, fruitData.stock);
        assert.strictEqual(options.id, fruitData.id);
        return Promise.resolve({ rowCount: 1 });
      }
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .put('/api/fruits/20')
      .send(fruitData)
      .expect(204);

    assert.strictEqual(response.statusCode, 204);
  });

  it('put - error - no name', async () => {
    const fruitData = {
      stock: 10
    };

    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .put('/api/fruits/20')
      .expect(422)
      .send(fruitData);

    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'The name is required!');
  });

  it('put - error - no stock', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .put('/api/fruits/20')
      .send({ name: 'name' })
      .expect(422);

    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'The stock must be greater or equal to 0!');
  });

  it('put - error - id error', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .put('/api/fruits/20')
      .send({ name: 'Banana', stock: 10, id: '22' })
      .expect(422);

    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'Id was invalidly set on request.');
  });

  it('put - error - not found', async () => {
    const fruitData = {
      name: 'Banana',
      stock: 10,
      id: '20'
    };

    const mockApi = {
      update: () => {
        return Promise.resolve({ rowCount: 0 });
      }
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .put('/api/fruits/20')
      .send(fruitData)
      .expect(404);

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.text, 'Unknown item 20');
  });

  it('put - error', async () => {
    const fruitData = {
      name: 'Banana',
      stock: 10,
      id: '22'
    };

    const mockApi = {
      update: () => {
        return Promise.reject(new Error('error'));
      }
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .put('/api/fruits/22')
      .send(fruitData)
      .expect(400);

    assert.strictEqual(response.statusCode, 400);
  });

  it('put - error - no payload', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .put('/api/fruits/20')
      .expect(415);

    assert.strictEqual(response.statusCode, 415);
    assert.strictEqual(response.text, 'Invalid payload!');
  });

  it('put - error - invalid payload', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .put('/api/fruits/20')
      .set('Content-Type', 'application/json')
      .send('Some text')
      .expect(415);

    assert.strictEqual(response.statusCode, 415);
    assert.strictEqual(response.text, 'Invalid payload!');
  });

  it('put - error - xml payload', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });
    const xmlFruitData = '<?xml version="1.0" encoding="UTF-8"?><fruit><name>Banana</name><stock>10</stock></fruit>';

    const response = await supertest(app)
      .put('/api/fruits/10')
      .set('Content-Type', 'application/xml')
      .send(xmlFruitData)
      .expect(415);

    assert.strictEqual(response.statusCode, 415);
    assert.strictEqual(response.text, 'Invalid payload!');
  });

  it('put - error - JSON Content-Type and XML body', async () => {
    const app = proxyquire('../app', {
      './lib/db': mockDb
    });
    const xmlFruitData = '<?xml version="1.0" encoding="UTF-8"?><fruit><name>adam</name><stock>10</stock></fruit>';

    const response = await supertest(app)
      .put('/api/fruits/10')
      .set('Content-Type', 'application/json')
      .send(xmlFruitData)
      .expect(415);

    assert.strictEqual(response.statusCode, 415);
    assert.strictEqual(response.text, 'Invalid payload!');
  });

  it('put - error - no numeric stock', async () => {
    const fruitData = {
      name: 'Banana',
      stock: 'two'
    };

    const app = proxyquire('../app', {
      './lib/db': mockDb
    });

    const response = await supertest(app)
      .put('/api/fruits/10')
      .send(fruitData)
      .expect(422);

    assert.strictEqual(response.statusCode, 422);
    assert.strictEqual(response.text, 'The stock must be greater or equal to 0!');
  });

  it('delete', async () => {
    const mockApi = {
      remove: id => {
        assert.strictEqual(id, '1');
        return Promise.resolve({ rowCount: 1 });
      }
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .delete('/api/fruits/1')
      .expect(204);

    assert.strictEqual(response.statusCode, 204);
  });

  it('delete - error - not found', async () => {
    const mockApi = {
      remove: () => {
        return Promise.resolve({ rowCount: 0 });
      }
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .delete('/api/fruits/1')
      .expect(404);

    assert.strictEqual(response.statusCode, 404);
    assert.strictEqual(response.text, 'Unknown item 1');
  });

  it('delete - error', async () => {
    const mockApi = {
      remove: () => {
        return Promise.reject(new Error('error'));
      }
    };

    // Mock the nested require
    const routesStub = proxyquire('../lib/routes/fruits', {
      '../api/fruits': mockApi
    });

    const app = proxyquire('../app', {
      './lib/db': mockDb,
      './lib/routes/fruits': routesStub
    });

    const response = await supertest(app)
      .delete('/api/fruits/1')
      .expect(400);

    assert.strictEqual(response.statusCode, 400);
  });
});
