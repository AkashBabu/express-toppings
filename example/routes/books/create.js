var { helper, helperResp, helperValidate, helperTransform } = require("../../toppings")
var db = require("mongojs")("test")

module.exports = function (collName) {
    return (req, res) => {
        var body = req.body;

        // For a complete list of possibilities please take a look at a API documentation
        var validations = [{
            name: 'name',
            type: 'string',
            validate: helperValidate.isName,
            validateErrMsg: 'Name can contain only a-z, A-Z, 0-9',
            errMsg: 'Name is required'
        }]

        helper.validateFieldsCb(body, validations, true, (err) => {
            if (err) {
                helperResp.failed(res, err);
            } else {
                db.collection(collName).insert(body, helperResp.handleResult(res));
            }
        })

    }
}