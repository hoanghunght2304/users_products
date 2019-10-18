'use strict';

const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

let ProductSchema = new Schema({
	_id: String,
  name: {
    type: String,
    sparse: true,
    text: true,
    trim: true,
    required: true
  },
	image: {
    type: String,
    required: true
  },
	price: {
    type: Number,
    required: true
  },
	discount: String,
	createdBy: {
		//token: String,
		id: String,
		name: String
	},
	created: {
		type: Date,
		default: Date.now
	},
	
});

ProductSchema.path('name').index({text : true});
//ProductSchema.index({name: 'text'});
// ProductSchema.index({'$**': 'text'});

module.exports = mongoose.model('Products', ProductSchema);