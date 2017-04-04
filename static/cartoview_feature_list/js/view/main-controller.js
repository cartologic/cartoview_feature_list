/**
 * Created by kamal on 7/2/16.
 */


angular.module('cartoview.featureListApp').controller('cartoview.featureListApp.MainController',
    function ($scope, mapService, $mdSidenav, $mdMedia, $mdDialog, appConfig) {
        $scope.config = appConfig;
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
        $scope.closeCommentNav = function () {
            $mdSidenav('comment').close();
        };
        $scope.closeImageNav=function () {
            $mdSidenav('image').close();
        }
    });