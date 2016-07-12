/**
 * Created by kamal on 7/3/16.
 */
angular.module('cartoview.mapViewerApp').service('featureListService', function(mapService, urlsHelper, $http, appConfig, $rootScope) {
    var DEFAULT_ITEM_TPL = urlsHelper.static + "viewer/angular-templates/view/default-list-item-tpl.html";
    var service = this;
    service.content = {
        results: []
    };
    var map = mapService.map;
    service.loading = 0;
    Object.defineProperty(this, 'hasContent', {
        get: function() {
            var hasContent = false;
            service.content.results.forEach(function (result) {
                if(result.features && result.features.length > 0){
                    hasContent = true;
                    return false;
                }
            });
            return hasContent;
        }
    });
    service.clearContent = function () {
        service.content.results = [];
        service.resultsLayer.get('source').clear();
        delete service.selected;
    };

    var getWMSLayer = function (name) {
        var wmsLayer = null;
        angular.forEach(mapService.map.overlays, function (layer) {
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

    //results management
    service.selectFeature = function (feature) {
        if(service.selected){
            service.selected.set('isSelected', false);
        }
        service.selected = feature;
        if(feature){
            // feature.result = result;
            feature.set('isSelected', true);
        }
    };

    var defaultPointStyle = new ol.style.Style({
        image: new ol.style.Circle({
            // fill: new ol.style.Fill({
            //     color: '#ff0000'
            // }),
            stroke: new ol.style.Stroke({
                color: '#000088',
                width: 2
            }),
            radius: 6
        })
    });
    var defaultPolygonStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#000088',
            width: 2
        })
    });
    var selectedPointStyle = new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: '#ffccff'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffffff'
            }),
            radius: 6
        })
    });
    var selectedPolygonStyle = new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#880000',
            width: 3
        })
    });

    var styleResults = function (feature) {
        var polygonStyle = defaultPolygonStyle, pointStyle = defaultPointStyle;
        if(feature.get('isSelected')){
            polygonStyle = selectedPolygonStyle;
            pointStyle = selectedPointStyle;
        }
        return [polygonStyle, pointStyle];
    };



    mapService.get().then(function () {
        service.resultsLayer = new ol.layer.Vector({
            source: new ol.source.Vector(),
            visible: true,
            style: styleResults
        });
        map.olMap.addLayer(service.resultsLayer);
        service.selectInteraction = new ol.interaction.Select({
            layers: [service.resultsLayer]
        });

        service.selectInteraction.on('select', function(event) {
            var feature = event.selected[0];
            service.selectFeature(feature);
            $rootScope.$apply()
        });
        map.olMap.addInteraction(service.selectInteraction);

        // var view = map.olMap.getView();
        // var viewResolution = view.getResolution();
        service.refresh();
    });
    service.refresh = function () {
        var resultsVectorSource = service.resultsLayer.get('source');
        service.clearContent();
        angular.forEach(appConfig.featureList.layers, function (layerConfig, layerName) {
            if (!layerConfig.included) return;
            var wmsLayer = getWMSLayer(layerName);
            wmsLayer.setVisible(false);
            var result = {
                layer: wmsLayer,
                features: [],
                title: wmsLayer.get('title'),
                listItemTpl: DEFAULT_ITEM_TPL,
                itemTpl: layerConfig.listItemTpl,
                detailsTpl: layerConfig.featureDetailsTpl
            };
            service.content.results.push(result);

            var url = wmsLayer.get('source').getUrls()[0];
            var params = {
                service: 'WFS',
                version: '2.0.0',
                request: 'GetFeature',
                typename: layerName,
                outputFormat: 'application/json',
                srsname: 'EPSG:3857'
            };
            url = urlsHelper.cartoviewGeoserverProxy + "wfs";
            service.loading++;
            $http.get(url, {
                params: params
            }).success(function (data) {
                service.loading--;
                result.features = new ol.format.GeoJSON().readFeatures(data);
                result.features.forEach(function (f, index, features) {
                    f.result = result;
                    if(typeof layerConfig.forEachFeature == 'function'){
                        layerConfig.forEachFeature(f, index, features);
                    }
                });

                resultsVectorSource.addFeatures(result.features);
            });
        });
    }
});
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
///////========================================///////////////////////////////////////////////////////////////////
angular.module('cartoview.mapViewerApp').service('aaService', function($http, urlsHelper, mapService, appConfig) {
    var service = this;
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

    function getCenterOfExtent(Extent) {
        var X = Extent[0] + (Extent[2] - Extent[0]) / 2;
        var Y = Extent[1] + (Extent[3] - Extent[1]) / 2;
        return [X, Y];
    }

    var geojsonFormat = new ol.format.GeoJSON();
    var createWFSLayer = function (url, layerConfig) {
        var params = {
            service: 'WFS',
            version: '2.0.0',
            request: 'GetFeature',
            typename: layerConfig.name,
            outputFormat: 'application/json',
            srsname: 'EPSG:3857'
        };
        url = urlsHelper.cartoviewProxy + "wfs";
        $http.get(url, {
            params: params
        }).success(function (data) {
            var vectorSource = new ol.source.Vector({
                features: geojsonFormat.readFeatures(data)
            });

            var vector = new ol.layer.Vector({
                source: vectorSource //,
                // style: featureStyle
            });
            vector.set('selectable', true);
            mapService.map.olMap.addLayer(vector);
            vectorSource.getFeatures().forEach(function (olFeature, i) {
                var item = {
                    id: olFeature.getId(),
                    layerName: layerConfig.name,
                    vectorSource: vectorSource,
                    olFeature: olFeature,
                    title: (olFeature.get(layerConfig.displayField) || "").toString().trim()
                };
                olFeature.__item = item;
                service.items.push(item)
            });
            //vectorSource.clear();
        });

    };

    mapService.get().then(function () {

        angular.forEach(appConfig.featureList.layers, function (layerConfig, layerName) {
            if (!layerConfig.included) return;
            var wmsLayer = getWMSLayer(layerName, mapService.map.overlays);
            wmsLayer.setVisible(false);
            var result = {
                layer: wmsLayer,
                features: [],
                title: wmsLayer.get('title'),
                listItemTpl: "default-list-item-tpl.html"
            };
            mapService.map.addContent(result);
            var url = wmsLayer.get('source').getUrls()[0];
            var params = {
                service: 'WFS',
                version: '2.0.0',
                request: 'GetFeature',
                typename: layerName,
                outputFormat: 'application/json',
                srsname: 'EPSG:3857'
            };
            url = urlsHelper.cartoviewGeoserverProxy + "wfs";
            $http.get(url, {
                params: params
            }).success(function (data) {
                result.features = geojsonFormat.readFeatures(data);
                var vectorSource = new ol.source.Vector({
                    features: result.features
                });

                var vector = new ol.layer.Vector({
                    source: vectorSource //,
                    // style: featureStyle
                });
                vector.set('selectable', true);
                mapService.map.olMap.addLayer(vector);
                vectorSource.getFeatures().forEach(function (f, i) {
                    f.properties = f.getProperties();
                    delete f.properties[f.getGeometryName()];
                });

            });
        });
    });
});