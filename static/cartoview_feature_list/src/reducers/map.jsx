import LayerSwitcher  from '../vendor/ol3-layerswitcher/src/ol3-layerswitcher'
import ol from 'openlayers'

let map_obj = new ol.Map( {
    interactions: ol.interaction.defaults().extend([
        new ol.interaction.DragRotateAndZoom()
      ]),
    layers: [ new ol.layer.Tile( {
        title: 'OpenStreetMap',
        source: new ol.source.OSM( )
    } ) ],
    view: new ol.View( {
        center: [
            0, 0
        ],
        zoom: 3,
        maxZoom:16
    } )
} )
var layerSwitcher = new LayerSwitcher()
map_obj.addControl(layerSwitcher)
export function map( state = map_obj, action ) {
    switch ( action.type ) {
    case 'SET_MAP':
        return action.map
    default:
        return state
    }
}
export function mapIsLoading( state = false, action ) {
    switch ( action.type ) {
    case 'MAP_IS_LOADING':
        return action.mapLoading
    default:
        return state
    }
}