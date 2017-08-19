// console.log("helper:", require("./data/helper"));
module.exports = function (app) {
    app.service('contentService', [function () {
        this.content = {
            "Helper": require("./data/helper"),
            "Response": require("./data/responses"),
            "Validations": require("./data/validations"),
            "Transformations": require("./data/transformations"),
            "MongoDB": require("./data/mongodb"),
            "CRUD": require("./data/crud"),
            "Session-JWT": require("./data/sess_jwt"),
            "Session-Cookie": require("./data/sess_cookies")
        }
    }])
}