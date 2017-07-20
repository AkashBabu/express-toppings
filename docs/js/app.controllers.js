module.exports = function (app) {
    app
        .value('duScrollDuration', 2000)
        .value('duScrollOffset', 30)

    app.controller("navCtrl", ['$mdMedia', '$scope', '$rootScope', '$location', "contentService", function ($mdMedia, $scope, $rootScope, $location, contentService) {
        var vm = this;
        $rootScope.showSidenav = $mdMedia("gt-sm");

        vm.content = contentService.content;

        vm.changeLocation = (location) => {
            $location.path(location);
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

    app.controller("introductionCtrl", ["$rootScope", function ($rootScope) {
        var vm = this;
        vm.toggleSidenav = () => {
            $rootScope.showSidenav = !$rootScope.showSidenav;
        }
    }])

    app.controller("apiCtrl", ["$mdMedia", "$rootScope", "$timeout", "$routeSegment", "$anchorScroll", "contentService", function ($mdMedia, $rootScope, $timeout, $routeSegment, $anchorScroll, contentService) {
        var vm = this;

        vm.content = contentService.content;

        vm.isString = (data) => {
            return typeof data == 'string';
        }

        vm.toggleSidenav = () => {
            $rootScope.showSidenav = !$rootScope.showSidenav;
        }

        vm.goto = (id) => {
            $anchorScroll(id);
        }

        vm.changeContent = (heading) => {
            vm.currHeading = heading;
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

    app.controller("buildAnAppCtrl", ["$rootScope", "$timeout", function ($rootScope, $timeout) {
        var vm = this;
        vm.toggleSidenav = () => {
            $rootScope.showSidenav = !$rootScope.showSidenav;
        }

        $timeout(() => {
            Prism.highlightAll();
        })
    }])

    app.controller("changeLogCtrl", ["$rootScope", "$timeout", function ($rootScope, $timeout) {
        var vm = this;
        vm.toggleSidenav = () => {
            $rootScope.showSidenav = !$rootScope.showSidenav;
        }

        $timeout(() => {
            Prism.highlightAll();
        })
    }])
}