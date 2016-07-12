/**
 * Created by kamal on 5/10/2016.
 */
newInstanceApp.directive('featureListConfig',  function() {
    return {
        transclude: true,
        replace: true,
        templateUrl: "config-fields.html",
        controller: function ($scope, dataService, $tastypieResource) {
            $scope.attributes = new $tastypieResource("geonodelayerattribute");
            $scope.instanceObj = dataService.instanceObj;
            $scope.mapLayers = [];
            $scope.layerAttributes = {};
            var layersDict = {};
            var initialized = false;
            var populateLayers = function () {
                $scope.mapLayers = [];
                angular.forEach(dataService.selected.map.map_layers, function (layer) {
                    if (!layer.fixed) {
                        layer.params = JSON.parse(layer.layer_params);
                        layersDict[layer.name] = layer;
                        $scope.mapLayers.push({
                            name: layer.name,
                            title: layer.params.title
                        });
                    }
                });

                
                if (!$scope.instanceObj.config.layers) {
                    $scope.instanceObj.config.layers = [];
                }
                $scope.instanceObj.config.layers.forEach(function(layer){
                	$scope.changerLayer(layer);
                });
                
            };
            dataService.onMapSelect(function () {
                $scope.instanceObj.config.layer = null;

                populateLayers();
            });
            $scope.changerLayer = function (layer) {
                if($scope.layerAttributes[layer.name]) return;
                $scope.layerAttributes[layer.name] = [];
                $scope.attributes.objects.$find({layer__typename: layer.name}).then(function () {
                    angular.forEach($scope.attributes.page.objects, function (attr) {
                        $scope.layerAttributes[layer.name].push({
                            name: attr.attribute,
                            title: attr.attribute_label || (attr.attribute + " "), //add space to fix angular bug when name and title is the same it isn't select the attribute in the drop down
                            type: attr.attribute_type
                        });
                    });
                });
            };

            $scope.canDisplay = function (attribure) {
                if (attribure.name == 'the_geom') {
                    return false;
                }
                return true;
            };

            $scope.isString = function (attribure) {
                if (attribure.type == 'xsd:string') {
                    return true;
                }
                return false;
            };
            $scope.toggleSelection = function (list, attribute) {
                var idx = list.indexOf(attribute.name);
                if (idx > -1) {
                    list.splice(idx, 1);
                }
                else {
                    list.push(attribute.name);
                }
            };
            populateLayers();


        }
    }
});