const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new Schema({
    name:String,
    email :String,
    password: String,
    phone:String,
    location: String,
    address: {
        address1: String,
        address2: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    active: Boolean,
    created: Date,
    createdby: String,
    lastmodified: Date,
    lastmodifiedby: String,
    deleted: Date,
    deletedby: String,
},{
    collection : 'User'

});

module.exports = mongoose.model('user', User);