var app = require('express')();
var bodyParser = require('body-parser');
var mongojs = require("mongojs")
var db = mongojs("sh_test")

var userColl = "users";

var Crud = require('../../dist/index').Crud;

var User = {}
User.create = function (req, res) {
    var body = req.body;

    db.collection(userColl).insert(body, (err, user) => {
        if (user) {
            res.status(200).send({ error: false, data: user })
        } else {
            res.status(err ? 500 : 400).send({ error: true, data: err ? err.code : "Failed to Create User" })
        }
    })
}

User.list = function (req, res) {
    db.collection(userColl).find({}, (err, users) => {
        if (users) {
            res.status(200).send({ error: false, data: users })
        } else {
            res.status(err ? 500 : 400).send({ error: true, data: err ? err.code : "Failed to Get a list of User" })
        }
    })
}
User.get = function (req, res) {
    db.collection(userColl).findOne({ _id: db.ObjectId(req.params.id) }, (err, user) => {
        if (user) {
            res.status(200).send({ error: false, data: user })
        } else {
            res.status(err ? 500 : 400).send({ error: true, data: err ? err.code : "Failed to get a User" })
        }
    })
}
User.update = function (req, res) {
    var body = req.body || {}

    delete body._id

    db.collection(userColl).update({ _id: db.ObjectId(req.params.id) }, { $set: body }, (err, result) => {
        if (result) {
            res.status(200).send({ error: false, data: result })
        } else {
            res.status(err ? 500 : 400).send({ error: true, data: err ? err.code : "Failed to Update a User" })
        }
    })
}
User.remove = function (req, res) {
    db.collection(userColl).remove({ _id: db.ObjectId(req.params.id) }, (err, result) => {
        if (result) {
            res.status(200).send({ error: false, data: result })
        } else {
            res.status(err ? 500 : 400).send({ error: true, data: err ? err.code : "Failed to Remove a User" })
        }
    })
}

User.removeMulti = (req, res) => {
    var ids = req.query.ids;

    db.collection(userColl).remove({ _id: { $in: ids } }, (err, result) => {
        if (result) {
            res.status(200).send({ error: false, data: result })
        } else {
            console.log('err:', err);
            res.status(err ? 500 : 400).send({ error: true, data: err ? err.code : "Failed to Remove Users" })
        }
    })
}

var UserCrud = new Crud(User);

app.use(bodyParser.json());

app.use('/users', UserCrud);

app.use(function (req, res) {
    res.status(404).send("Not Found")
})

module.exports = app