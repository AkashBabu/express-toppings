var router = require('express').Router();
var bookColl = 'books'

var Book = {
    create: require("./create")(bookColl),
    get: require("./get")(bookColl),
    list: require("./list")(bookColl),
    update: require("./update")(bookColl),
    remove: require("./remove")(bookColl),
}

var Crud = require("express-toppings").Crud;
var BookCrud = new Crud(Book);

router.use(BookCrud);

module.exports = router;