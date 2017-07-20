module.exports = function (app) {
    app.config(["$routeProvider", '$routeSegmentProvider', function ($routeProvider, $routeSegmentProvider) {

        $routeSegmentProvider
            .when("/introduction", "introduction")
            .when('/api', "api")
            .when('/api/:module', "apiSelect")
            .when("/buildAnApp", "buildAnApp")
            .when("/changeLog", "changeLog")

            .segment("introduction", {
                default: true,
                // template: require("../partials/introduction.html")
                templateUrl: 'partials/introduction.html',
                controller: 'introductionCtrl',
                controllerAs: 'vm'
            })
            .segment("api", {
                // template: require("../partials/api.html"),
                templateUrl: "partials/api.html",
                controller: 'apiCtrl',
                controllerAs: 'vm'
            })
            .segment("apiSelect", {
                // template: require("../partials/api.html"),
                templateUrl: "partials/api.html",
                controller: 'apiCtrl',
                controllerAs: 'vm',
                dependencies: ['module']
            })
            .segment('buildAnApp', {
                // template: require("../partials/buildAnApp.html")
                templateUrl: "partials/buildAnApp.html",
                controller: 'buildAnAppCtrl',
                controllerAs: 'vm'
            })
            .segment('changeLog', {
                // template: require("../partials/buildAnApp.html")
                templateUrl: "partials/changeLog.html",
                controller: 'changeLogCtrl',
                controllerAs: 'vm'
            })

        $routeProvider
            .otherwise({
                redirectTo: '/introduction'
            })

    }])
}