var { helperMongo, helperResp } = require("../../toppings")

module.exports = function (collName) {
    return (req, res) => {
        helperMongo.getById(collName, req.params.id, helperResp.handleResult(res));
    }
}