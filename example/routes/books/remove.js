var { helperMongo, helperResp } = require("../../toppings")

module.exports = function (collName) {
    return (req, res) => {
        helperMongo.remove(collName, req.params.id, true, helperResp.handleResult(res));
    }
}