'use strict';

const mongoose = require('mongoose'),
	User = mongoose.model('Users'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcrypt');


exports.list_all_users = (req, res) => {
	User.find({}, (err, user) => {
		if (err)
			res.send(err);
		res.json(user);
	});
};

exports.find_user = (req, res) => {

};

// exports.create_a_user = (req, res) => {
// 	req.body._id = mongoose.Types.ObjectId();
// 	let newUser = new User(req.body);
// 	newUser.save((err, user) => {
// 		if (err)
// 			res.send(err);
// 		res.json(user);	
// 	});
// };

exports.read_a_user = (req, res) => {
	User.findById(req.params.userId, (err, user) => {
		if (err)
			res.send(err);
		res.json(user);
	});
};

exports.update_a_user = (req, res) => {
	User.findByIdAndUpdate(req.params.userId, req.body, { new: true }, (err, user) => {
		if (err)
			res.send(err);
		res.json(user);
	});
};

exports.delete_a_user = (req, res) => {
	User.findByIdAndDelete(req.params.userId, (err, user) => {
		if (err)
			res.send(err);
		res.json({ message: 'Người dùng đã bị xóa' });
	});
};

exports.register = (req, res) => {
	let { username, password, name } = req.body;
	bcrypt.hash(password, 10, (err, hash) => {
		if (err)
			res.status(400).send(err);
		else {
			let newUser = new User({
				_id : mongoose.Types.ObjectId(),
				username,
				password,
				name,
				hashPassword: hash
			});
			newUser.save((err, user) => {
				if (err)
					res.status(400).send(err);
				else {
					user.hashPassword = undefined;
					return res.json(user);
				}
			});
		}
	});
};

exports.login = (req, res) => {
	User.findOne({
		username: req.body.username
	}, (err, user) => {
		if (err) throw err;
		if (!user) {
			res.status(401).json({ message: 'Tài khoản không tồn tại' });
		}
		if (user.password !== req.body.password) res.status(401).json({ message: 'Mật khẩu không đúng' });
		else {
			res.json({ token: jwt.sign({ id: user._id, username: user.username, name: user.name }, 'HoangHung', { expiresIn: '1h' }) });
		}
	}
	);
};