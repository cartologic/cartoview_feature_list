/**
 * Created by kamal on 6/29/16.
 */
angular.module('cartoview.featureListApp').directive('featureList', function (urlsHelper) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: urlsHelper.static + "cartoview_feature_list/angular-templates/feature-list.html",
        controller: function ($scope, featureListService, $timeout) {
            $scope.featureList = featureListService;
            $scope.getIdentifier = function () {
                return featureListService.appConfig.id + "-" + featureListService.selected.getId();
            };
            $scope.gallary = false;
            $scope.toggleGallary = function () {
                $scope.gallary = !$scope.gallary;
            }
            $scope.comments = false;
            $scope.toggleComments = function () {
                $scope.comments = !$scope.comments;
            }
            $scope.table = false;
            $scope.toggleTable = function () {
                $scope.table = !$scope.table;
            }
        }
    }
});

angular.module('cartoview.featureListApp').directive('dynamicTemplate', function ($compile) {
    return {
        restrict: 'A',
        scope: {
            feature: '=',
            template: '='
        },
        controller: function ($scope, $element, $compile) {
            $scope.$watch(function () {
                return $scope.feature;
            }, function () {
                if ($scope.feature) {
                    $element.html($scope.template);
                    angular.extend($scope, $scope.feature.getProperties());
                    $compile($element.contents())($scope);
                }
            });
        }
    }
});