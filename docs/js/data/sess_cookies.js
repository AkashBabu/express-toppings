module.exports = {
    desc: "Cookie Session implementation in Express",
    initialCode: `
var Cookie = require('express-toppings').Session.Cookie;

interface ICookieOptions {
    collName: string;
    connStr: string;
    login: IPassportOptions;
    register: IPassportOptions;
    cookie: Object;
    secret: string;
    redisStore: Object;
    passportSerializer?: (user, cb) => void;
    passportDeserializer?: (userId, cb) => void;
    passportLogin?: (req, email, passport, cb) => void;
    passportRegister?: (req, email, passport, cb) => void;
}

var options: ICookieOptions = {
    collName: 'users', // user collection name
    connStr: 'test', // mongoDB connection string
    login: { // Passport Login options
        successRedirect: '/index.html',
        failureRedirect: '/login.html',
        failureFlash: flash
    },
    register: { // Passport Register options
        successRedirect: '/index.html',
        failureRedirect: '/register.html',
        failureFlash: flash
    },
    cookie: { // express-session cookie options
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: true,
    },
    secret: 'secret',
    redisStore: { // Connect-redis connection options
        ttl: 1000 * 60 * 60 * 24,
        host: "localhost",
        port: 6379,
        prefix: "sess:"
    }
}
// if you wish to have custom logic for passport local-strategy then
// you must specify options.passportSerializer, options.passportDeserializer, options.passportLogin and options.passportRegister functions. 
// These function signature are similar to that of passport functions

var passport = require("passport");
var cookie = new Cookie(options);
var app = express();

// this order has to be maintained
cookie.configurePassport(passport);
cookie.configureSession(app)

app.use(cookie.validate(['/login.html', '/register.html', {method: 'POST', url: '/login'}, '/register'], '/portal/login'))

app.post('/login', cookie.login());
app.post('/register', cookie.register());

app.get("/logout", cookie.logout());
                `,
    methods: [{
        id: 'login',
        name: 'login() => Express Middleware',
        nav: 'login',
        desc: 'Validates if the user exists and then sets Session Cookie on the express response object',
    }, {
        id: 'register',
        name: 'register() => Express Middleware',
        nav: 'register',
        desc: 'Will create and insert a User and sets Session Cookies on the express response object',
    }, {
        id: 'logout',
        name: 'logout() => Express Middleware',
        nav: 'logout',
        desc: 'Will remove cookie session and go to next() router in the middlewares',
    }, {
        id: 'validate',
        name: 'validate(whitelist?: (string | IUrl)[], failureRedirect?: string): Express Middleware',
        nav: 'validate',
        desc: 'If the url is whitelisted next() middleware is called. If the cookie exists n if the cookie is valid then req.user is set on express request object. If not then the user is redirected to failureRedirectUrl else 401 is sent',
    }]
}