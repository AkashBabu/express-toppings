module.exports = {
    desc: "Create standard CRUD APIs",
    initialCode: `
var CRUD = require('express-toppings').Crud;
function create() {
    return (req, res, next) => {
        // Some Operation
    }
}
var user = {
    create: create(),
    get: get(),
    list: list(),
    update: update(),
    remove: remove(),
    removeMulti: removeMulti()
}            

var router = express.Router();

router.use("/user", new CRUD(user));

// The above line would create 5 APIs as follows
// POST /users/ -- user.create
// GET /users/:id -- user.get
// GET /users/ -- user.list
// PUT /users/:id -- user.update
// DELETE /users/:id -- user.remove
// DELETE /users?ids=12345&ids=56789 -- user.removeMulti
                `,
}