var { Helper, HelperMongo, HelperResp, HelperValidate, HelperTransform } = require("express-toppings");

let helper = new Helper();
let helperMongo = new HelperMongo("test");
let helperResp = new HelperResp();
let helperValidate = new HelperValidate();
let helperTransform = new HelperTransform();

module.exports = { helper, helperMongo, helperResp, helperValidate, helperTransform };