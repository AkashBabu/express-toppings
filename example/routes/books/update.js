var { helperMongo, helperResp } = require("../../toppings")

module.exports = function (collName) {
    return (req, res) => {
        helperMongo.update(collName, req.body, ["password"], helperResp.handleResult(res));
    }
}