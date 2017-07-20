var { helperMongo, helperResp } = require("../../toppings")

module.exports = function (collName) {
    return (req, res) => {

        // Just the below line will support pagination, sorting, search, project fields and filter(match query)
        // for further details please look at Api documentation
        helperMongo.getList(collName, req.query, helperResp.handleResult(res));
    }
}
