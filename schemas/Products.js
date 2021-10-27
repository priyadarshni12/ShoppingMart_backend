const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Products = new Schema({
    productId: String,
    name:String,
    displayImage: String,
    price: Number,
    brand: String,
    color: String,
    size: String,
    description: String,
    created: Date,
    createdby: String,
    lastmodified: Date,
    lastmodifiedby: String,
    deleted: Date,
    deletedby: String,
},{
    collection : 'Product'

});

module.exports = mongoose.model('Products', Products);