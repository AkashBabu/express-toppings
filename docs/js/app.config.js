module.exports = function (app) {
    app.config(["$routeProvider", '$routeSegmentProvider', function ($routeProvider, $routeSegmentProvider) {

        $routeSegmentProvider
            // .when("/introduction", "introduction")
            .when('/api', "api")
            .when('/api/:module', "apiSelect")
            .when("/buildAnApp", "buildAnApp")
            .when("/changeLog", "changeLog")

            // .segment("introduction", {
            //     templateUrl: 'partials/introduction.html',
            //     controller: 'introductionCtrl',
            //     controllerAs: 'vm'
            // })
            .segment("api", {
                // default: true,
                templateUrl: "partials/api.html",
                controller: 'apiCtrl',
                controllerAs: 'vm'
            })
            .segment("apiSelect", {
                templateUrl: "partials/api.html",
                controller: 'apiCtrl',
                controllerAs: 'vm',
                dependencies: ['module']
            })
            .segment('buildAnApp', {
                default: true,
                templateUrl: "partials/buildAnApp.html",
                controller: 'buildAnAppCtrl',
                controllerAs: 'vm'
            })
            .segment('changeLog', {
                templateUrl: "partials/changeLog.html",
                controller: 'changeLogCtrl',
                controllerAs: 'vm'
            })

        $routeProvider
            .otherwise({
                redirectTo: '/api'
            })

    }])
}