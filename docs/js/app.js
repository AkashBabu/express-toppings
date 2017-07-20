require("jquery")
require("angular")
require("angular-aria")
require("angular-animate")
require("angular-material")
require("angular-route")
require("angular-route-segment")
require("prismjs")
// require("angular-scroll")

require("angular-material/angular-material.css")
require("prismjs/themes/prism")
require("../css/style.css");

var app = angular.module('app', ['ngAria', 'ngAnimate', 'ngMaterial', "ngRoute",
    "route-segment", 'view-segment',
    // 'duScroll'
]);

require("./app.config")(app);
require("./app.services")(app);
require("./app.controllers")(app);
// require("./app.directives")(app);