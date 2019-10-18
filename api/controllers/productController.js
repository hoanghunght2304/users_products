'use strict';

const mongoose = require('mongoose'),
  Product = mongoose.model('Products'),
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');

exports.list_all_products = (req, res) => {

  Product.find({}, (err, product) => {
    if (err)
      res.sen(err);
    res.json(product)
  });
};

exports.list_products_for_user = (req, res) => {

  let id = JSON.parse(req.headers['token']).id;
  let query = {};
  if (req.query.q) {
    query = {
      ...query,
      price: { $gte: req.query.q }
    }
  }

  if (req.query.name) {
    query = {
      ...query,
      // $text: {$search: {$trim: {input: req.query.name}}}
      //$trim: {input: req.query.name}
      $text: {$search: req.query.name}
      //name: new RegExp('^' + req.query.name, 'i')
    }
  }
  Product.find(query,
    (err, product) => {
      if (err)
        res.send(err);
      res.json(product);
    }).collation({ locale: 'en', strength: 1 });
};


exports.create_a_product_for_user = (req, res) => {
  //let body = req.body;
  req.body.createdBy = JSON.parse(req.headers['token']);

  // Product.aggregate([
  //   {
  //     $match: { _id: req.params.productId }
  //   },
  //   {
  //     $lookup: {
  //       from: 'users',
  //       localField: '_id',
  //       foreignField: 'createdBy.id',
  //       as: 'users'
  //     }
  //   }
  // ]);

  req.body._id = mongoose.Types.ObjectId();
  let newProduct = new Product(req.body);
  //console.log(req.body);
  newProduct.save((err, product) => {
    if (err)
      res.send(err);
    res.json(product);
  });
};


exports.read_a_product_for_user = async (req, res) => {

  let aggregate = [
    {
      $match: { _id: req.params.prdforuserId }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'createdBy.id',
        foreignField: '_id',
        as: 'users'
      }
    }
  ]
  let product = await Product.aggregate(aggregate);

  res.json(product);
};


exports.update_a_product_for_user = (req, res) => {
  Product.findByIdAndUpdate(req.params.prdforuserId, req.body, { new: true }, (err, product) => {
    if (err)
      res.sen(err);
    res.json(product);
  });
};


exports.delete_a_product_for_user = (req, res) => {
  Product.findByIdAndDelete(req.params.prdforuserId, (err, product) => {
    if (err)
      res.send(err);
    res.json({ message: 'Sản phẩm đã bị xóa' });
  });
};



