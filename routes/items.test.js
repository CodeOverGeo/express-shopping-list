process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');

let items = require('../fakeDb');

let item = { name: 'testItem', price: '1138' };

beforeEach(async () => {
  items.push(item);
});

afterEach(async () => {
  items = [];
});

describe('GET /items', function () {
  test('Gets a list of items', async function () {
    const response = await request(app).get(`/items`);
    const { items } = response.body;
    expect(response.statusCode).toBe(200);
    expect(items).toHaveLength(1);
  });
});

describe('GET /items/:name', function () {
  test('Gets a single item', async function () {
    const response = await request(app).get(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual(item.name);
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).get(`/items/0`);
    expect(response.statusCode).toBe(404);
  });
});

// TODO: add 404 for request with incorrect parameters

describe('POST /items', function () {
  test('Creates a new item', async function () {
    const response = await request(app).post(`/items`).send({
      name: 'theOtherOne',
      price: 555,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('price');
    expect(response.body.name).toEqual('theOtherOne');
    expect(response.body.price).toEqual(555);
  });
});

describe('PATCH /items/:name', function () {
  test('Updates a single item', async function () {
    const response = await request(app).patch(`/items/${item.name}`).send({
      name: 'juice',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      name: 'juice',
      price: '1138',
    });
  });

  test("Responds with 404 if can't find item", async function () {
    const response = await request(app).patch(`/items/0`);
    expect(response.statusCode).toBe(404);
  });
});

describe('DELETE /items/:name', function () {
  test('Deletes a single a item', async function () {
    const response = await request(app).delete(`/items/${item.name}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Deleted' });
  });
});
