var express = require("express");
var toppings = require("express-toppings");
var bodyParser = require("body-parser")

var app = express();

// Please note the global variable. 
// Because you may need to initialize a db connection only once, 
// which if initialized mulitple time on each route would consume more resource and time

var JWT = toppings.Session.JWT;

// JWT Options
var options = {
    collName: 'users', // user collection name
    connStr: "test", // MongoDB connection string
    secret: 'secret',
    validity: 1, // In days
}

// This is very important
app.use(bodyParser.json());

// Initialize JWT
var jwt = new JWT(options);

app.post("/login", jwt.login())
app.post("/register", jwt.register())

// Specify all Urls which could be accessed without Logging in.
var whitelistUrl = [{ method: "GET", url: "/public-data" }];
app.use(jwt.validate(whitelistUrl));

var BookRouter = require("./routes/books/route")
app.use("/api/books", BookRouter)

app.get("/public-data", (req, res) => {
    res.send({ data: 'This api does not require any login' });
})

app.listen(8080, (err) => {
    if (!err) {
        console.log('Server running on port 8080');
    }
})