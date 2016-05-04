'use strict';
var mapLayersApp = angular.module('cartoview.mapLayersSwitcher', [ 'ngeo', 'cartoview.map']);

mapLayersApp.directive('cartoviewMapLayers',  function($http) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope:{
            configUrl: "@",
            mapId: "@"
        },
        controller:function($scope, $element, $compile, mapService){
            $scope.map = mapService.get($scope.mapId, $scope.configUrl);
            $scope.map.promise.then(function(){

            });
        }
    }
});