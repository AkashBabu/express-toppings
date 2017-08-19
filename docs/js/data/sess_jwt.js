module.exports = {
    desc: "JWT implementation on express",
    initialCode: `
var JWT = require("express-toppings").Session.JWT
interface IJWTOptions {
    collName: string;
    connStr: string;
    secret: string;
    validity: number;
    emailField?: string;
    passwordField?: string;
    login?: (user, cb) => void;
    register?: (user, cb) => void;
    validate?: (user, cb) => void;
}

var options: IJWTOptions = {
    collName: "users", // users collection
    connStr: 'jwt_test', // MongoDB connection string
    secret: 'secret',
    validity: 1, // In days
    emailField: "email",
    passwordField: "password",
}
var jwt = new JWT(options, true);

app.post("/login", jwt.login())
app.post("/register", jwt.register())
app.use(jwt.validate())

// all other authenticated routes follow this
                `,
    methods: [{
        id: 'login',
        name: 'login() => ExpressMiddleware',
        nav: 'login',
        return: {
            type: 'ExpressMiddleware',
            desc: 'Middleware that can handle user login'
        },
        desc: `Middleware that by default handles user login by fetching an user matching the email and verifying saltHash of the password field and returning JWT token, if a login fn is provided then the same would be used for fetching and validating a user`,
        example: [`
app.post("/login", jwt.login())
                    `]
    }, {
        id: 'register',
        name: "register() => ExpressMiddleware",
        nav: 'register',
        return: {
            type: 'ExpressMiddleware',
            desc: 'Middleware that can handle user register'
        },
        desc: 'Middleware that by default handles user register by checking uniqueness of email and salthashing password field and returning JWT token, if a register fn is provided then the same would be used',
        example: [
            `
app.post("/register", jwt.register())
                        `
        ]
    }, {
        id: 'validate',
        name: 'validate() => ExpressMiddleware',
        nav: 'validate',
        return: {
            type: 'ExpressMiddleware',
            desc: 'Middleware that can handle validation'
        },
        desc: 'Middleware that by default handles validation by checking if the token has not been expired and the corresponding id is valid, if a validate fn is provided then the same would be used to fetch the user corresponding to the id',
        example: [
            `
// Use it from the point where authentication is expected
app.use(jwt.validate())
                        `
        ]
    }]
}