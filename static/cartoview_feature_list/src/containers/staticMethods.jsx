import LayerSwitcher from '../vendor/ol3-layerswitcher/src/ol3-layerswitcher'
import ol from 'openlayers'
export const isWMSLayer = (layer) => {
    return layer.getSource() instanceof ol.source.TileWMS || layer.getSource() instanceof ol
        .source.ImageWMS
}
export const wmsGetFeatureInfoFormats = {
    'application/json': new ol.format.GeoJSON(),
    'application/vnd.ogc.gml': new ol.format.WMSGetFeatureInfo()
}
export const getFeatureInfoUrl = (layer, coordinate, view, infoFormat) => {
    const resolution = view.getResolution(),
        projection = view.getProjection()
    const url = layer.getSource().getGetFeatureInfoUrl(coordinate,
        resolution, projection, {
            'INFO_FORMAT': infoFormat
        })
    return `${url}&FEATURE_COUNT=10`
}
export const getMap = () => {
    const map = new ol.Map({
        interactions: ol.interaction.defaults().extend([
            new ol.interaction.DragRotateAndZoom()
        ]),
        layers: [new ol.layer.Tile({
            title: 'OpenStreetMap',
            source: new ol.source.OSM()
        })],
        view: new ol.View({
            center: [
                0, 0
            ],
            minZoom: 4,
            maxZoom: 16
        })
    })
    let layerSwitcher = new LayerSwitcher()
    map.addControl(layerSwitcher)
    return map
}
export const getWMSLayer = (name, layers) => {
    let wmsLayer = null
    layers.forEach((layer) => {
        if (layer instanceof ol.layer.Group) {
            wmsLayer = getWMSLayer(name, layer.getLayers())
        } else if (isWMSLayer(layer) && layer.getSource().getParams()
            .LAYERS == name) {
            wmsLayer = layer
        }
        if (wmsLayer) {
            return false
        }
    })
    return wmsLayer
}
export const addSelectionLayer = (map, featureCollection, styleFunction) => {
    new ol.layer.Vector({
        source: new ol.source.Vector({ features: featureCollection }),
        style: styleFunction,
        title: "Selected Features",
        zIndex: 10000,
        format: new ol.format.GeoJSON({
            defaultDataProjection: map.getView().getProjection(),
            featureProjection: map.getView().getProjection()
        }),
        map: map
    })
}
export const getLayers = (layers) => {
    var children = []
    layers.forEach((layer) => {
        if (layer instanceof ol.layer.Group) {
            children = children.concat(getLayers(layer.getLayers()))
        } else if (layer.getVisible() && isWMSLayer(layer)) {
            children.push(layer)
        }
    })
    return children
}