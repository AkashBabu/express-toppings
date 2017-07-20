var Helper = require("express-toppings").Helper;
var helper = new Helper();

var password = "test123"

var user = {
    email: 'test@mail.com',
    password: helper.saltHash(password),
    name: "Test User"
}

require("mongojs")("test").collection("users").insert(user, (err, result) => {
    console.log("Dummy user with email:", user.email, ' and ', password, ' has been created');
})