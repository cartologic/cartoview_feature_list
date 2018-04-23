import DragRotateAndZoom from 'ol/interaction/dragrotateandzoom'
import FileSaver from 'file-saver'
import FullScreen from 'ol/control/fullscreen'
import LayerHelper from 'Source/helpers/LayersHelper'
import Map from 'ol/map'
import OSM from 'ol/source/osm'
import OverviewMap from 'ol/control/overviewmap'
import Tile from 'ol/layer/tile'
import View from 'ol/view'
import extent from 'ol/extent'
import filter from 'ol/format/filter';
import interaction from 'ol/interaction'
import isURL from 'validator/lib/isURL'
import proj from 'ol/proj'
class FeatureListHelper {
    getCenterOfExtent = (ext) => {
        const center = extent.getCenter(ext)
        return center
    }
    getAttachmentTags = (config) => {
        const configTags = config.attachmentTags
        const tags = (configTags && configTags.length > 0) ? configTags : [
            `feature_list_${LayerHelper.layerName(config.layer)}`]
        return tags
    }
    getSelectOptions = (arr, label = null, value = null) => {
        let options = []
        if (arr && arr.length > 0) {
            options = arr.map(item => {
                if (!label) {
                    return { value: item, label: item }
                }
                return { value: item[label], label: item[value ? value : label] }
            })
        }
        return options

    }
    checkImageSrc = (src, good, bad) => {
        let img = new Image()
        img.onload = good
        img.onerror = bad
        img.src = src
    }
    getFilterByName = (attrs, attrName) => {
        let attributeType = null
        if (attrs) {
            attrs.forEach(attr => {
                if (attr.attribute === attrName) {
                    attributeType = attr.attribute_type
                }
            })
        }
        return attributeType
    }
    getFilter = (config, filterType, value) => {
        /* 
        this function should return the proper filter based on 
        filter type
        working with strings & numbers
        test Needed 😈
        */
        let olFilter = filter.like(config.filters, '%' + value + '%',
            undefined, undefined, undefined, false)
        if (filterType !== 'string') {
            olFilter = filter.equalTo(config.filters, value)
        }
        return olFilter
    }
    getMap = () => {
        let osmLayer = new Tile({
            title: 'OpenStreetMap',
            source: new OSM()
        })
        let map = new Map({
            interactions: interaction.defaults().extend([
                new DragRotateAndZoom()
            ]),
            layers: [osmLayer],
            view: new View({
                center: proj.fromLonLat([0, 0]),
                minZoom: 4,
                maxZoom: 16,
                zoom: 6
            })
        })
        map.addControl(new OverviewMap())
        map.addControl(new FullScreen({ source: "root" }))
        return map
    }
    zoomToLocation = (pointArray, map) => {
        const zoom = map.getView().getMaxZoom()
        const lonLat = this.reprojectLocation(pointArray, map)
        map.getView().setCenter(lonLat)
        map.getView().setZoom(zoom - 4)
    }
    reprojectLocation = (pointArray, map) => {
        /**
         * Reproject x,y .
         * @constructor
         * @param {array} point - [longitude,latitude].
         */
        return proj.transform(pointArray, 'EPSG:4326', map.getView().getProjection())
    }
    reprojectExtent = (extent, map) => {
        /**
         * Reproject extent .
         * @constructor
         * @param {array} extent - [minX,minY,maxX,maxY].
         */
        return proj.transformExtent(extent, 'EPSG:4326', map.getView().getProjection())
    }
    exportMap = (map) => {
        map.once('postcompose', (event) => {
            let canvas = event.context.canvas
            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(canvas.msToBlob(), 'map.png')
            } else {
                canvas.toBlob((blob) => {
                    FileSaver.saveAs(blob, 'map.png')
                })
            }
        })
        map.renderSync()
    }
    checkURL = (value) => {
        /* validator validate strings only */
        if (typeof (value) === "string") {
            return isURL(value)
        }
        return false
    }
}
export default new FeatureListHelper()
