const items = require('../fakeDb');
const express = require('express');
const ExpressError = require('../expressError');
const { json } = require('express');

const router = express.Router();

router.get('', (req, res, next) => {
  try {
    if (items.length === 0) {
      throw new ExpressError('No items in database', 204);
    } else {
      return res.json({ items });
    }
  } catch (err) {
    return next(err);
  }
});

router.post('', (req, res, next) => {
  try {
    if (req.body.name != undefined && req.body.price != undefined) {
      let newItem = { name: req.body.name, price: req.body.price };
      items.push(newItem);
      return res.json(items[items.length - 1]);
    } else {
      throw new ExpressError('Please send name of item and price', 404);
    }
  } catch (err) {
    return next(err);
  }
});

router.get('/:name', (req, res, next) => {
  try {
    let requestedItem = items.find((v) => v.name === req.params.name);
    if (requestedItem === undefined) {
      throw new ExpressError('Item not found', 404);
    } else {
      return res.json(requestedItem);
    }
  } catch (err) {
    return next(err);
  }
});

router.patch('/:name', (req, res, next) => {
  try {
    let patchName = req.params.name;
    let itemIndex = items.findIndex((x) => x.name == patchName);
    if (patchName != undefined && itemIndex != -1) {
      let name = req.body.name ? req.body.name : items[itemIndex.name];
      let price = req.body.price ? req.body.price : items[itemIndex]['price'];
      items[itemIndex] = { name, price };
      return res.json(items[itemIndex]);
    } else {
      throw new ExpressError('Item not found', 404);
    }
  } catch (err) {
    return next(err);
  }
});

router.delete('/:name', (req, res, next) => {
  try {
    let deletedName = req.params.name;
    let deleteIndex = items.findIndex((x) => x.name == deletedName);
    if (deleteIndex === -1) {
      throw new ExpressError('Item not found', 404);
    } else {
      items.splice(deleteIndex, 1);
      return res.json({ message: 'Deleted' });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
