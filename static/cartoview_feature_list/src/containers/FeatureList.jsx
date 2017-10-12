import {
    addSelectionLayer,
    getFeatureInfoUrl,
    getLayers,
    getMap,
    getWMSLayer,
    isWMSLayer,
    wmsGetFeatureInfoFormats
} from './staticMethods'

import { Component } from 'react'
import LayerSwitcher from '../vendor/ol3-layerswitcher/src/ol3-layerswitcher'
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService'
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService'
import PropTypes from 'prop-types'
import ol from 'openlayers'
import { styleFunction } from './styling.jsx'
import { wfsQueryBuilder } from "../helpers/helpers.jsx"

class FeatureListContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapIsLoading: false,
            featuresIsLoading: false,
            totalFeatures: 0,
            features: null,
            searchResultIsLoading: false,
            searchModeEnable: false,
            searchTotalFeatures: 0,
            attachmentIsLoading: false,
            attachments: null,
            selectionModeEnabled: false,
            selectedFeatures: null,
            featureIdentifyLoading: false,
            featureIdentifyResult: false,
            activeFeatures: 0
        }
        this.map = getMap()
        this.featureCollection = new ol.Collection()
        this.addSelectionLayer(this.map, this.featureCollection,
            styleFunction)
    }
    componentWillMount() {
        const { urls, typeName, count, startIndex } = this.props
        this.loadMap(urls.mapJsonURL)
        this.getFeatures(url.wfsURL, typeName, count, startIndex)
    }
    componentDidMount() {
        this.singleClickListner()
    }
    loadMap = (mapUrl) => {
        this.setState({ mapIsLoading: true })
        fetch(mapUrl, {
            method: "GET",
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then((config) => {
            if (config) {
                MapConfigService.load(MapConfigTransformService.transform(
                    config), this.map)
                this.setState({ mapIsLoading: false })
            }
        }).catch((error) => {
            throw Error(error)
        })
    }
    getFeatures(url, typeName, count, startIndex) {
        let { totalFeatures } = this.state
        this.setState({ featuresIsLoading: true })
        const requestUrl = wfsQueryBuilder(url, {
            service: 'wfs',
            version: '2.0.0',
            request: 'GetFeature',
            typeNames: typeName,
            outputFormat: 'json',
            srsName: this.map.getView().getProjection().getCode(),
            count,
            startIndex
        })
        fetch(requestUrl).then((response) => response.json()).then(
            (data) => {
                this.setState({ featuresIsLoading: false })
                let features = new ol.format.GeoJSON().readFeatures(
                    data, {
                        featureProjection: this.map.getView().getProjection()
                    })
                const total = data.totalFeatures
                if (totalFeatures == 0) {
                    this.setState({ totalFeatures: total })
                }
                this.setState(features)
            })
    }
    search = (wfsURL, text, layerNameSpace, selectedLayerName, property) => {
        /* 
        Openlayer build request to avoid errors
        undefined passed to filter to skip paramters and
        use default values
        */
        let { searchTotalFeatures } = this.state
        this.setState({ searchResultIsLoading: true, searchModeEnable: true })
        var request = new ol.format.WFS().writeGetFeature({
            srsName: this.map.getView().getProjection().getCode(),
            featureNS: 'http://www.geonode.org/',
            featurePrefix: layerNameSpace,
            outputFormat: 'application/json',
            featureTypes: [selectedLayerName],
            filter: ol.format.filter.like(property, '%' + text +
                '%', undefined, undefined, undefined, false)
        })
        fetch(wfsURL, {
            method: 'POST',
            body: new XMLSerializer().serializeToString(request)
        }).then((response) => {
            return response.json()
        }).then((json) => {
            let features = new ol.format.GeoJSON().readFeatures(
                json)
            const total = json.totalFeatures
            if (searchTotalFeatures == 0) {
                this.setState({ searchTotalFeatures: total })
            }
            this.setState({
                searchResultIsLoading: false,
                features
            })
        })
    }
    loadAttachments = (attachmentURL) => {
        this.setState({ attachmentIsLoading: true })
        fetch(attachmentURL).then((response) => response.json()).then(
            (data) => {
                this.setState({
                    attachmentIsLoading: false,
                    attachments: data
                })
            }).catch((error) => {
                throw Error(error)
            })
    }
    zoomToFeature = (feature) => {
        this.map.getView().fit(feature.getGeometry().getExtent(), this
            .map.getSize(), { duration: 10000 })
    }
    singleClickListner = () => {
        this.map.on('singleclick', (e) => {
            this.setState({
                featureIdentifyLoading: true,
                activeFeatures: 0,
                featureIdentifyResult: null
            })
            document.body.style.cursor = "progress"
            this.featureIdentify(this.map, e.coordinate)
        })
    }
    transformFeatures = (layer, features, map, crs) => {
        let transformedFeatures = []
        features.forEach((feature) => {
            feature.getGeometry().transform('EPSG:' + crs, map.getView()
                .getProjection())
            feature.set("_layerTitle", layer.get('title'))
            transformedFeatures.push(feature)
        })
        this.setState({
            featureIdentifyResult: transformedFeatures,
            activeFeatures: 0,
            featureIdentifyLoading: false
        })
        document.body.style.cursor = "default"
    }
    addStyleToFeature = () => {
        let { featureIdentifyResult, activeFeatures } = this.state
        if (featureIdentifyResult.length > 0) {
            this.featureCollection.clear()
            this.featureCollection.push(featureIdentifyResult[
                activeFeatures])
        }
    }
    featureIdentify = (map, coordinate) => {
        getLayers(map.getLayers().getArray()).forEach(
            (layer) => {
                const view = map.getView()
                const url = getFeatureInfoUrl(layer, coordinate, view,
                    'application/json')
                fetch(url).then((response) => response.json()).then(
                    (result) => {
                        if (result.features.length > 0) {
                            const features =
                                wmsGetFeatureInfoFormats[
                                    'application/json'].readFeatures(
                                    result)
                            const crs = result.features.length > 0 ?
                                result.crs.properties.name.split(
                                    ":").pop() : null
                            if (proj4.defs('EPSG:' + crs)) {
                                this.transformFeatures(layer,
                                    features, map, crs)
                            } else {
                                fetch(
                                    "https://epsg.io/?format=json&q=" +
                                    crs).then(response =>
                                        response.json()).then(
                                    projres => {
                                        proj4.defs('EPSG:' +
                                            crs, projres.results[
                                                0].proj4)
                                        this.transformFeatures(
                                            layer,
                                            features, map,
                                            crs)
                                    })
                            }
                        } else {
                            this.setState({
                                featureIdentifyResult: [],
                                activeFeatures: 0,
                                featureIdentifyLoading: false
                            })
                            document.body.style.cursor = "default"
                        }
                        this.addStyleToFeature()
                    })
            })
    }
    render() {
        return null
    }
}
FeatureListContainer.propTypes = {
    urls:PropTypes.object.isRequired
}
