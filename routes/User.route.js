let express = require('express');
let userRoutes = express.Router()
let UserSchema = require('../schemas/user');

require('dotenv').config();

userRoutes.route('/').get(function (req, res) {
    UserSchema.find({}, {}, function (err, users) {
        if (err)
            res.status(400).send(err);
        else
            res.json(users);
    });
});

userRoutes.route('/getValidEmails/:withPassword').get(function (req, res) {
    UserSchema.find({ deleted: null }, {
        email: true,
        password: req.params.withPassword ? true : false
    }, function (err, users) {
        if (err)
            res.status(400).send(err);
        else
            res.json(users);
    });
});

userRoutes.route('/addNewUser/').post(function (req, res) {
    let user = new UserSchema(req.body)
    user.created = new Date();
    user.active = true;
    user.save()
        .then(user => {
            res.json(user);
        })
        .catch(err => res.json(err))
});

userRoutes.route('/disableUser/email/:email').post(function (req, res) {
    UserSchema.find({ email: req.params.email }, function (err, user) {
        user.active = false;
        user.lastmodified = new Date();
        user.lastmodifiedby = req.body.username;
        user.save()
            .then(user => {
                res.json(user);
            })
            .catch(err => res.json(err))
    });
});

userRoutes.route('/disableUser/phone/:phone').post(function (req, res) {
    UserSchema.find({ phone: req.params.phone }, function (err, user) {
        user.active = false;
        user.lastmodified = new Date();
        user.lastmodifiedby = req.body.username;
        user.save()
            .then(user => {
                res.json(user);
            })
            .catch(err => res.json(err))
    });
});

userRoutes.route('/enableUser/email/:email').post(function (req, res) {
    UserSchema.find({ email: req.params.email }, function (err, user) {
        user.active = true;
        user.lastmodified = new Date();
        user.lastmodifiedby = req.body.username;
        user.save()
            .then(user => {
                res.json(user);
            })
            .catch(err => res.json(err))
    });
});

userRoutes.route('/enableUser/phone/:phone').post(function (req, res) {
    UserSchema.find({ phone: req.params.phone }, function (err, user) {
        user.active = true;
        user.lastmodified = new Date();
        user.lastmodifiedby = req.body.username;
        user.save()
            .then(user => {
                res.json(user);
            })
            .catch(err => res.json(err))
    });
});

userRoutes.route('/:email').get(function (req, res) {
    UserSchema.find({ email: req.params.email }, function (err, user) {
        if (err)
            res.status(400).send(err);
        else
            res.json(user);
    });
});

module.exports = userRoutes;
