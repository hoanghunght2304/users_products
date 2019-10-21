require('dotenv').config();

const express = require('express'),
	app = express(),
	port = process.env.PORT,
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	jwt = require('jsonwebtoken');


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    jwt.verify(req.headers.authorization.split(' ')[1], 'HoangHung', (err, decode) => {
      if (err) req.user = undefined;
      req.user = decode;
      next();
    });
  } else {
    req.user = undefined;
    next();
  }
});

const userRoutes = require('./api/routes/userRoutes'),
	User = require('./api/models/userModel'),
	productRoutes = require('./api/routes/productRoutes'),
	Product = require('./api/models/productModel');

userRoutes(app);
productRoutes(app);


app.listen(port);

console.log(`Login started on: ${port}`);