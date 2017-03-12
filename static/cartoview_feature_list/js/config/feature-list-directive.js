/**
 * Created by kamal on 6/29/16.
 */
angular.module('cartoview.viewer.editor').directive('featureListConfig', function (urlsHelper) {
    return {
        transclude: true,
        replace: true,
        templateUrl: urlsHelper.static + "cartoview_feature_list/angular-templates/config-fields.html?" + new Date().getTime(),
        controller: function ($scope, dataService, $tastypieResource) {
            $scope.attributes = new $tastypieResource("geonodelayerattribute");

            $scope.instanceObj = dataService.instanceObj;
            $scope.instanceObj.config.featureList = $scope.instanceObj.config.featureList || {};
            $scope.instanceObj.config.featureList.layers = $scope.instanceObj.config.featureList.layers || {};

            $scope.mapLayers = [];
            $scope.layerAttributes = {};
            var layersDict = {};
            var initialized = false;
            var populateLayers = function () {
                $scope.mapLayers = [];
                if (dataService.selected.map) {
                    angular.forEach(dataService.selected.map.map_layers, function (layer) {
                        if (!layer.fixed) {
                            layer.params = JSON.parse(layer.layer_params);
                            layersDict[layer.name] = layer;
                            var layerInfo = {
                                name: layer.name,
                                title: layer.params.title
                            };
                            Object.defineProperty(layerInfo, 'included', {
                                configurable: true,
                                get: function () {
                                    return $scope.instanceObj.config.featureList.layers[layerInfo.name].included;
                                },
                                set: function (val) {
                                    $scope.instanceObj.config.featureList.layers[layerInfo.name].included = val;
                                    if (val) {
                                        $scope.initLayerConfig(layerInfo)
                                    }
                                }
                            });
                            $scope.mapLayers.push(layerInfo);

                            if (!$scope.instanceObj.config.featureList.layers[layer.name]) {
                                $scope.instanceObj.config.featureList.layers[layer.name] = {};
                            }
                        }
                    });
                }

                // if (!$scope.instanceObj.config.layers) {
                //     $scope.instanceObj.config.layers = [];
                // }
                // $scope.instanceObj.config.layers.forEach(function(layer){
                // 	$scope.changerLayer(layer);
                // });
                $scope.currentLayer = $scope.mapLayers[0];
            };
            $scope.selectLayer = function (layer) {
                $scope.currentLayer = layer;
            };
            $scope.isIncluded = function (layer) {
                var config = $scope.instanceObj.config.featureList.layers[layer.name];
                return config != undefined && config.included;
            };
            $scope.toggleInclude = function (layer) {

            };
            dataService.onMapSelect(function () {
                $scope.instanceObj.config.layer = null;

                populateLayers();
            });
            $scope.initLayerConfig = function (layer) {
                var config = $scope.instanceObj.config.featureList.layers[layer.name];
                if (config.listItemTpl) return;
                $scope.layerAttributes[layer.name] = [];
                $scope.attributes.objects.$find({layer__typename: layer.name}).then(function () {
                    var featureDetailsTpl = ["<table>"];
                    angular.forEach($scope.attributes.page.objects, function (attr) {

                        $scope.layerAttributes[layer.name].push({
                            name: attr.attribute,
                            title: attr.attribute_label || (attr.attribute + " "), //add space to fix angular bug when name and title is the same it isn't select the attribute in the drop down
                            type: attr.attribute_type
                        });
                        if (attr.attribute_type.indexOf("gml") != 0) {
                            featureDetailsTpl.push("<tr>"
                                + "<th>" + (attr.attribute_label || attr.attribute) + "</th>"
                                + "<td>{{" + attr.attribute + "}}</td>"
                                + "</tr>");
                        }
                    });
                    featureDetailsTpl.push("</table>");
                    config.featureDetailsTpl = featureDetailsTpl.join("");
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