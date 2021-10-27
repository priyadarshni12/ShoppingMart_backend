let express = require('express');
let productRoutes = express.Router()
let ProductSchema = require('../schemas/Products');
var fs = require('fs');

const aws = require('aws-sdk');
require('dotenv').config();

const S3_BUCKET = process.env.AWS_BUCKET
const s3 = new aws.S3({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const signUrl = (url) => {
    if (url) {
        return s3.getSignedUrl('getObject', {
            Bucket: S3_BUCKET,
            Key: url,
            Expires: 60 * 60,
        });
    }
    return;
};

const transformProducts = (product) => {
    product.displayImage = signUrl(product.displayImage)
    return product;
};

productRoutes.route('/').get(function (req, res) {
    ProductSchema.find({ deleted: null }, {}, function (err, products) {
        if (err)
            res.status(400).send(err);
        else
            res.status(200).json(products.map(transformProducts));
    });
});

productRoutes.route('/addProduct').post(function (req, res) {
    ProductSchema.find(function (err, products) {
        let newProduct = new ProductSchema(req.body);
        let len = products.length + 1;
        if (len < 10) {
            newProduct.productId = "P000" + len;
        }
        else {
            newProduct.productId = "P00" + len;
        }
        newProduct.created = new Date();
        const file = req.files ? req.files.displayImage : null;
        if (file) {
            const fileName = newProduct.productId + "-" + file.name;
            const fileType = file.mimeType;
            const s3Params = {
                Bucket: S3_BUCKET,
                Key: fileName,
                Body: file.data,
                ContentType: fileType
            };
            s3.upload(s3Params, function (err, data) {
                if (err) {
                    res.status(500).json({ error: true, Message: err });
                }
                else {
                    console.log(data);
                    newProduct.displayImage = fileName;
                    newProduct.save()
                        .then(product => {
                            res.json(product);
                        })
                        .catch(err => res.json(err))
                }
            });
        }
        else {
            newProduct.save()
                .then(product => {
                    res.json(product);
                })
                .catch(err => res.json(err))
        }
    });
});

productRoutes.route('/delProduct/:productId').post(function (req, res) {
    ProductSchema.find({ productId: req.params.productId }, {}, function (err, product) {
        if (product.length) {
            product = product[0];
            const date = new Date();
            product.deleted = date;
            product.lastmodified = date;
            product.deletedby = req.body.username;
            product.lastmodifiedby = req.body.username;
            product.save()
                .then(product => {
                    res.json(product);
                })
                .catch(err => res.json(err))
        }
        else {
            res.json(err);
        }
    });
});


module.exports = productRoutes;
