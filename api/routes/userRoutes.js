'use strict'

module.exports = app => {
	let controller = require('../controllers/userController');

	app.route('/users')
		.get(controller.list_all_users)
		.get(controller.find_user);
    //.post(controller.create_a_user);

  app.route('/users/:userId')
    .get(controller.read_a_user)
    .put(controller.update_a_user)
    .delete(controller.delete_a_user);

  app.route('/register')
    .post(controller.register);

  app.route('/login')
    .post(controller.login);
};