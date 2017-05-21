/**
 * Created by kamal on 7/2/16.
 */


angular.module('cartoview.featureListApp').controller('cartoview.featureListApp.MainController',
    function ($scope, mapService, featureListService, $mdSidenav, $mdMedia, $mdDialog, appConfig) {
        $scope.config = appConfig;
        $scope.authenticated = cartoviewUser.isAuthenticated;
        $scope.toggleSidenav = function () {
            return $mdSidenav('left').toggle();
        };
        $scope.map = mapService.map;
        $scope.sideRight = true;
        $scope.isOpenRight = function () {
            // return $mdSidenav('right').toggle();
            $mdSidenav('left').close().then(function () {
                $scope.sideRight = true;
            });

        };
        if (featureListService.selected) {
            console.log(featureListService.selected.getId())
        }
        $scope.getIdentifier = function () {
            return featureListService.appConfig.id + "-" + featureListService.selected.getId();
        };
        $scope.mobile = false;
        $scope.mapShow = true;
        if (window.innerWidth <= 800) {
            $scope.mobile = true;
        }
        else {
            $scope.mobile = false;
        }
        $(window).on("resize.doResize", function () {

            $scope.$apply(function () {
                if (window.innerWidth <= 800) {
                    $scope.mobile = true;
                }
                else {
                    $scope.mobile = false;
                    $scope.mapShow = true;
                }
            });
        });
        $scope.showhideList = function () {
            $scope.mapShow = !$scope.mapShow
        };
        $scope.closeSidenav = function () {
            $mdSidenav('left').close();
        };
    });