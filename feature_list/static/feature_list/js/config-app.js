var featureLisConfigApp = angular.module('featureLisConfigApp', []);
featureLisConfigApp.controller('mapPanelsController', function($scope){

});
featureLisConfigApp.directive('featureListConfig',  function() {
    return {
        transclude: true,
        replace: true,
        controller:function($scope, $element, $compile){
            var newElement = $compile( '<div>KOKO</div>' )( $scope );
            $element.parent().append( newElement );
        }
    }
});