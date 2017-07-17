/**
 * Created by kamal on 6/28/16.
 */
angular.module('cartoview.viewer.editor').directive('basicControls', function(urlsHelper) {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: urlsHelper.static + "cartoview_feature_list/angular-templates/edit/basic-controls.html",
        controller: function($scope, dataService, $mdMedia, $mdDialog) {
            $scope.instanceObj = dataService.instanceObj;
            $scope.selected = dataService.selected;
            
            
        }
    }
});
