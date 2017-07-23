module.exports = function (app) {

    app.controller("navCtrl", ['$mdMedia', '$scope', '$rootScope', '$location', "contentService", "$routeSegment", function ($mdMedia, $scope, $rootScope, $location, contentService, $routeSegment) {
        var vm = this;
        $rootScope.showSidenav = $mdMedia("gt-sm");

        vm.content = contentService.content;

        vm.changeLocation = (location) => {
            $location.path(location);
        }

        vm.isSegment = (segment) => {
            return $location.path() == $routeSegment.getSegmentUrl(segment);
        }

        vm.isUrl = (url) => {
            return $location.path() == url;
        }

        vm.isApiSelected = () => {
            return $location.path().startsWith("/api");
        }

        // Watch if the screen has been resized and Show/Hide the sidenav accordingly
        $scope.$watch(() => {
            return !$mdMedia("gt-sm")
        }, (newVal) => {
            if (newVal) {
                $rootScope.showSidenav = false;
            } else {
                $rootScope.showSidenav = true;
            }
        })


    }])

    app.controller("commonCtrl", ['$rootScope', "$timeout", function ($rootScope, $timeout) {
        var vm = this;

        vm.toggleSidenav = () => {
            $rootScope.showSidenav = !$rootScope.showSidenav;
        }

        $timeout(() => {
            Prism.highlightAll();
        })
    }])

    app.controller("introductionCtrl", ["$controller", "$scope", function ($controller, $scope) {
        var vm = this;
        angular.extend(vm, $controller("commonCtrl", { $scope: $scope }))
        vm.heading = "Introduction";
    }])

    app.controller("apiCtrl", ["$controller", "$mdMedia", "$scope", "$timeout", "$routeSegment", "$anchorScroll", "contentService", function ($controller, $mdMedia, $scope, $timeout, $routeSegment, $anchorScroll, contentService) {
        var vm = this;
        angular.extend(vm, $controller("commonCtrl", { $scope: $scope }))

        vm.content = contentService.content;

        vm.isString = (data) => {
            return typeof data == 'string';
        }

        vm.goto = (id) => {
            $anchorScroll(id);
        }

        vm.changeContent = (heading) => {
            vm.currHeading = heading;
            vm.heading = "API - " + vm.currHeading;
            vm.currContent = vm.content[vm.currHeading]
            $timeout(() => {
                Prism.highlightAll();
            })
        }

        vm.getType = function (param) {
            if (param.type) {
                return param.type
            }

            var desc = param.desc;
            if (desc) {
                var start = desc.indexOf('[');
                var end = desc.lastIndexOf(']');

                if (start == -1 || end == -1) {
                    return false;
                } else {
                    return desc.slice(start + 1, end);
                }
            } else {
                return false;
            }
        }

        vm.getDesc = function (param) {
            if (param.type) {
                return param.desc;
            }

            var desc = param.desc
            if (desc) {
                var end = desc.lastIndexOf("]");

                if (end > -1) {
                    return desc.slice(end + 2)
                } else {
                    return desc;
                }
            } else {
                return false;
            }
        }

        vm.changeContent($routeSegment.$routeParams.module || "Helper");
    }])

    app.controller("buildAnAppCtrl", ["$controller", "$scope", function ($controller, $scope) {
        var vm = this;
        angular.extend(vm, $controller("commonCtrl", { $scope: $scope }))
        vm.heading = "Building an app with Express-Toppings"
    }])

    app.controller("changeLogCtrl", ["$controller", "$scope", function ($controller, $scope) {
        var vm = this;
        angular.extend(vm, $controller("commonCtrl", { $scope: $scope }))
        vm.heading = 'Change Log'
    }])
}