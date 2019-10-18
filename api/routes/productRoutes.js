'use strict'

module.exports = app => {
  let controller = require('../controllers/productController');

  app.route('/products')
    .get(controller.list_all_products);

  app.route('/prdforuser')
    .get(controller.list_products_for_user)
    .post(controller.create_a_product_for_user);

  app.route('/prdforuser/:prdforuserId')
    .get(controller.read_a_product_for_user)
    .put(controller.update_a_product_for_user)
    .delete(controller.delete_a_product_for_user);
};