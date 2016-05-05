var featureListApp = angular.module('featureListApp', [
    'ui.layout',
    'ui.bootstrap',
    'cartoview.map'
]);
featureListApp.controller('featureListController', function($scope) {
    // appConfig is a global variable set in django template
    //TODO: use angular service to get
    $scope.appConfig = appConfig;
    $scope.rowLayoutOptions = {
        dividerSize: 0
    };
    $scope.columnLayoutOptions = {
        flow: 'column',
        dividerSize: 0
    };

});
featureListApp.directive('featureList', function($http) {

    var selectedPointStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#ff0000'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffccff'
            }),
            radius: 8
        })
    });
    var selectedPolygonStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#ff0000',
            width: 2
        })
    });
    var getWMSLayer = function(name, layers) {
        var wmsLayer = null;
        angular.forEach(layers, function(layer) {
            if (layer.getLayers) {
                wmsLayer = getWMSLayer(name, layer.getLayers());
            } else {
                var layerSource = layer.get('source');
                if (layerSource && layerSource.getParams) {
                    var params = layerSource.getParams();
                    if (params && params.LAYERS == name) {
                        wmsLayer = layer;
                    }
                }
            }
            if (wmsLayer) {
                return false
            }
        });
        return wmsLayer;
    };

    function featureStyle(feature) {
        return [new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(230,120,30,0.7)'
                })
            })
        })]
    }
    function getCenterOfExtent(Extent){
        var X = Extent[0] + (Extent[2]-Extent[0])/2;
        var Y = Extent[1] + (Extent[3]-Extent[1])/2;
        return [X, Y];
    }
    var geojsonFormat = new ol.format.GeoJSON();
    var createWFSLayer = function(url, layerConfig, scope) {
        var params = {
            service: 'WFS',
            version: '2.0.0',
            request: 'GetFeature',
            typename: layerConfig.name,
            outputFormat: 'application/json',
            srsname: 'EPSG:3857'
        };
        url = PROXY_URL + encodeURIComponent(url + "?" + $.param(params));
        $http.get(url, {
            //params: params
        }).success(function(data) {
            var vectorSource = new ol.source.Vector({
                features: geojsonFormat.readFeatures(data)
            });

            var vector = new ol.layer.Vector({
                source: vectorSource //,
                    // style: featureStyle
            });
            vector.set('selectable', true);
            scope.map.olMap.addLayer(vector);
            vectorSource.getFeatures().forEach(function(olFeature, i) {
                var item = {
                    id: olFeature.getId(),
                    layerName: layerConfig.name,
                    vectorSource: vectorSource,
                    olFeature: olFeature,
                    title: (olFeature.get(layerConfig.displayField) || "").toString().trim()
                };
                olFeature.__item = item;
                scope.items.push(item)
            });
            //vectorSource.clear();
        });

    };
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: ANGULAR_TEMPLATES_URL + "feature-list.html",
        scope: {
            appId: "@"
        },
        controller: function($scope, $element, $compile, $http, $uibModal, mapService, $templateRequest, ngeoDebounce) {
            angular.extend($scope, {
                map: mapService.get($scope.appId),
                data: [],
                search: {
                    term: '',
                    run: false
                },
                sortType: 'title',
                sortReverse: false,
                items: []
            });


            $scope.map.promise.then(function() {
                angular.forEach(appConfig.layers, function(layerConfig) {
                    var wmsLayer = getWMSLayer(layerConfig.name, $scope.map.olMap.getLayers());
                    wmsLayer.setVisible(false);
                    var url = wmsLayer.get('source').getUrls()[0];
                    createWFSLayer(url, layerConfig, $scope);
                    var view = $scope.map.olMap.getView();
                    $scope.search.extent = view.calculateExtent($scope.map.olMap.getSize())
                    view.on('propertychange', function() {
                        $scope.search.extent = view.calculateExtent($scope.map.olMap.getSize())
                    });
                });

                // $scope.map.olMap.on('click', function(evt) {
                //     var pixel = $scope.map.olMap.getEventPixel(evt.originalEvent);
                //     var olFeature = $scope.map.olMap.forEachFeatureAtPixel(pixel, function(feature, layer) {
                //         return feature;
                //     });
                //     if(olFeature){
                //         console.debug(olFeature)
                //     }
                // });

                $scope.selectInteraction = new ol.interaction.Select({
                    layers: function(layer) {
                        return layer.get('selectable') == true;
                    },
                    style: [selectedPointStyle, selectedPolygonStyle]
                });
                $scope.map.olMap.addInteraction($scope.selectInteraction);
                // $scope.selectedItemsCollection = selectInteraction.getFeatures();
                $scope.selectInteraction.on('select', function(event) {
                    var feature = event.selected[0];
                    if(feature){
                        $scope.selectedItem = feature.__item;
                        showPopup();
                    }
                    else{
                        $scope.selectedItem = null;
                        hidePopup();
                    }
                    $scope.$apply()

                });

                $scope.popup = new ol.Overlay({
                    element: document.getElementById('popup')
                });
                $scope.map.olMap.addOverlay($scope.popup);
            });
            $scope.showItem = function(item) {

                item.vectorSource.addFeature(item.olFeature);
                if (item.title.toLowerCase().indexOf($scope.search.term.toLowerCase()) > -1) {
                    if ($scope.search.extent) {
                        //console.debug($scope.search.extent);
                    }
                    return true;

                } else {
                    item.vectorSource.removeFeature(item.olFeature);
                    return false;
                }
            };

            $scope.selectedItem = null;
            $scope.selectItem = function(item) {
                $scope.selectInteraction.getFeatures().clear();
                $scope.selectInteraction.getFeatures().push(item.olFeature);

                $scope.selectedItem = item;
                showPopup();
            };
            var hidePopup = function () {
                var element = $scope.popup.getElement();
                $(element).popover('destroy');
            };
            var showPopup = function () {

                var element = $scope.popup.getElement();
                var coordinate = getCenterOfExtent($scope.selectedItem.olFeature.getGeometry().getExtent());
                $(element).popover('destroy');
                $scope.popup.setPosition(coordinate);
                $templateRequest('popup.html').then(function(html){

                    $(element).popover({
                        'placement': 'top',
                        'animation': false,
                        'html': true,
                        title: $scope.selectedItem.title,
                        'content': $compile(html)($scope),
                        template:'<div class="popover feature-list-popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'

                    });

                    $(element).on('shown.bs.popover',function () {
                        var map = $scope.map.olMap;
                        var pixel = map.getPixelFromCoordinate(coordinate);
                        // get DOM element generated by Bootstrap
                        var bs_element = $(element).next("div.popover");
                        var offset_height = 10;
                        // get computed popup height and add some offset
                        var popup_height = bs_element.height() + offset_height;
                        // how much space (height) left between clicked pixel and top
                        var height_left = pixel[1] - popup_height;
                        var view = map.getView();
                        // get the actual center
                        var center = view.getCenter();

                        if (height_left < 0) {
                            var center_px = map.getPixelFromCoordinate(center);
                            var new_center_px = [
                                center_px[0],
                                center_px[1] + height_left
                            ];

                            map.beforeRender(ol.animation.pan({
                                source: center,
                                start: Date.now(),
                                duration: 300
                            }));
                            view.setCenter(map.getCoordinateFromPixel(new_center_px));
                        }
                    });
                    $(element).popover('show');

                });
            }

        }
    }
});