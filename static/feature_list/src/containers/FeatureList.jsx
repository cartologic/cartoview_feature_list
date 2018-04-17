import 'ol/ol.css'
import '../css/view.css'
import 'typeface-roboto'

import FeaturesHelper, { wfsFormats, wmsGetFeatureInfoFormats } from 'Source/helpers/FeaturesHelper'
import React, { Component } from 'react'

import AnimationHelper from 'Source/helpers/AnimationHelper'
import Collection from 'ol/collection'
import FeatureList from '../components/view/FeatureList'
import FeatureListHelper from 'Source/helpers/FeatureListHelper'
import LayersHelper from 'Source/helpers/LayersHelper'
import MapConfigService from 'Source/services/MapConfigService'
import MapConfigTransformService from 'Source/services/MapConfigTransformService'
import PropTypes from 'prop-types'
import URLS from './URLS'
import { getCRSFToken } from '../helpers/helpers.jsx'
import injectTapEventPlugin from "react-tap-event-plugin"
import proj from 'ol/proj'
import proj4 from 'proj4'
import { render } from 'react-dom'
import { styleFunction } from 'Source/helpers/StyleHelper'
import { wfsQueryBuilder } from "../helpers/helpers.jsx"

injectTapEventPlugin()
proj.setProj4(proj4)
class FeatureListContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapIsLoading: true,
            featuresIsLoading: true,
            totalFeatures: 0,
            features: null,
            searchResultIsLoading: false,
            searchModeEnable: false,
            searchTotalFeatures: 0,
            searchResult: null,
            attachmentIsLoading: false,
            commentsIsLoading: true,
            attachments: null,
            comments: null,
            map: FeatureListHelper.getMap(),
            selectionModeEnabled: false,
            featureIdentifyLoading: false,
            featureIdentifyResult: null,
            featureCollection: new Collection(),
            activeFeatures: null,
            filterType: null,
            ImageBase64: null,
            drawerOpen: true,
            detailsModeEnabled: false,
            detailsOfFeature: null
        }
        this.urls = new URLS(this.props.urls)
        LayersHelper.addSelectionLayer(this.state.map, this.state.featureCollection,
            styleFunction)
    }
    toggleDrawer = () => {
        const { drawerOpen } = this.state
        this.setState({ drawerOpen: !drawerOpen })
    }
    readThenSave = (file, featureId) => {
        const { config } = this.props
        const { attachments } = this.state
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const apiData = {
                file: reader.result,
                file_name: `${featureId}.png`,
                username: config.username,
                is_image: true,
                feature_id: featureId,
                tags: FeatureListHelper.getAttachmentTags(config)
            }
            this.saveAttachment(apiData).then(result => {
                this.setState({
                    attachments: [...
                        attachments, result]
                })
            })
        }
        reader.onerror = (error) => {
            throw (error)
        }
    }
    SaveImageBase64 = (file, featureId) => {
        this.readThenSave(file, featureId)
    }
    getImageFromURL = (url, featureId) => {
        const proxiedURL = this.urls.getProxiedURL(url)
        FeatureListHelper.checkImageSrc(proxiedURL, () => {
            fetch(proxiedURL, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Accept": "image/*"
                }
            }).then(response => response.blob()).then(blob => {
                this.readThenSave(blob, featureId)
            })
        }, () => alert("bad Image"))
    }
    addComment = (data) => {
        const { urls, config } = this.props
        const apiData = { ...data, username: config.username }
        const { comments } = this.state
        const url = urls.commentsUploadUrl(LayersHelper.layerName(config
            .layer))
        return fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            }),
            body: JSON.stringify(apiData)
        }).then((response) => response.json()).then(result => {
            this.setState({ comments: [...comments, result] })
        })
    }
    getFilterType = () => {
        const { urls, config } = this.props
        fetch(`${urls.layerAttributes}?layer__typename=${config.layer}`, {
            method: "GET",
            credentials: 'include'
        }).then((response) => response.json()).then((data) => {
            const filterType = FeatureListHelper.getFilterByName(
                data.objects, config.filters).split(":").pop()
            this.setState({ filterType })
        }).catch((error) => {
            throw Error(error)
        })
    }
    componentWillMount() {
        const { urls, config } = this.props
        if (config.filters) {
            this.getFilterType()
        }
        this.loadMap(urls.mapJsonUrl, urls.proxy)
        this.getFeatures(0)
        this.getCommentsAndFiles().then(([attachments, comments]) => {
            this.setState({ attachments, comments }, this.setAttachmentCommentsLoading(
                false))
        })
    }
    setAttachmentCommentsLoading = (loading) => {
        this.setState({ attachmentIsLoading: loading, commentsIsLoading: loading })
    }
    searchFilesById = (id) => {
        const { attachments } = this.state
        let result = []
        if (attachments) {
            attachments.map((imageObj) => {
                if (imageObj.is_image && imageObj.feature_id === id) {
                    result.push(imageObj)
                }
            })
        }
        return result
    }
    searchCommentById = (id) => {
        const { comments } = this.state
        let result = []
        if (comments) {
            comments.map((comment) => {
                if (comment.feature_id === id) {
                    result.push(comment)
                }
            })
        }
        return result
    }
    componentDidMount() {
        this.singleClickListner()
    }
    loadMap = (mapUrl, proxyURL) => {
        let { map } = this.state
        fetch(mapUrl, {
            method: "GET",
            credentials: 'include'
        }).then((response) => {
            return response.json()
        }).then((config) => {
            if (config) {
                MapConfigService.load(MapConfigTransformService.transform(
                    config), map, proxyURL)
                this.setState({ mapIsLoading: false })
            }
        }).catch((error) => {
            throw Error(error)
        })
    }
    getFeatures = (startIndex) => {
        let { totalFeatures, map } = this.state
        const { urls, config } = this.props
        const requestUrl = wfsQueryBuilder(urls.wfsURL, {
            service: 'wfs',
            version: '2.0.0',
            request: 'GetFeature',
            typeNames: config.layer,
            outputFormat: 'json',
            srsName: map.getView().getProjection().getCode(),
            count: parseInt(config.pagination),
            startIndex
        })
        fetch(this.urls.getProxiedURL(requestUrl)).then((response) =>
            response.json()).then(
                (data) => {
                    let features = wmsGetFeatureInfoFormats[
                        'application/json'].readFeatures(data, {
                            featureProjection: map.getView().getProjection()
                        })
                    let newData = { features, featuresIsLoading: false }
                    const total = data.totalFeatures
                    if (totalFeatures === 0) {
                        newData['totalFeatures'] = total
                    }
                    this.setState(newData)
                })
    }
    search = (text) => {
        /* 
        Openlayer build request to avoid errors
        undefined passed to filter to skip paramters and
        use default values
        */
        const { urls, config } = this.props
        const { filterType, map } = this.state
        this.setState({ searchResultIsLoading: true, searchModeEnable: true })
        var request = new wfsFormats['wfs'].writeGetFeature({
            srsName: map.getView().getProjection().getCode(),
            featureNS: 'http://www.geonode.org/',
            featurePrefix: LayersHelper.layerNameSpace(config.layer),
            outputFormat: 'application/json',
            featureTypes: [LayersHelper.layerName(config.layer)],
            filter: FeatureListHelper.getFilter(config,
                filterType, text),
            maxFeatures: 20
        })
        return fetch(this.urls.getProxiedURL(urls.wfsURL), {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": getCRSFToken()
            },
            body: new XMLSerializer().serializeToString(request)
        }).then((response) => {
            this.setState({ searchResultIsLoading: false })
            return response.json()
        })
    }
    loadAttachments = (attachmentURL) => {
        const proxiedURL = this.urls.getProxiedURL(attachmentURL)
        return fetch(proxiedURL).then((response) => response.json())
    }
    getCommentsAndFiles = () => {
        const { config, urls } = this.props
        const typename = LayersHelper.layerName(config.layer)
        const filesURL = urls.attachmentUploadUrl(typename)
        const commentsURL = urls.commentsUploadUrl(typename)
        return Promise.all([this.loadAttachments(filesURL), this.loadAttachments(
            commentsURL)])
    }
    saveAttachment = (data) => {
        const { urls, config } = this.props
        const url = urls.attachmentUploadUrl(LayersHelper.layerName(
            config.layer))
        return fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers({
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            }),
            body: JSON.stringify(data)
        }).then((response) => response.json())
    }
    zoomToFeature = (feature) => {
        const { config } = this.props
        let { map } = this.state
        if (config && config.zoomOnSelect) {
            const featureCenter = feature.getGeometry().getExtent()
            const center = FeatureListHelper.getCenterOfExtent(
                featureCenter)
            AnimationHelper.flyTo(center, map.getView(), 14, () => { })
        }
    }
    singleClickListner = () => {
        let { map } = this.state
        map.on('singleclick', (e) => {
            this.setState({
                featureIdentifyLoading: true,
                activeFeatures: null,
                featureIdentifyResult: null,
                selectionModeEnabled: true
            })
            this.featureIdentify(map, e.coordinate)
        })
    }
    backToAllFeatures = () => {
        this.setState({
            selectionModeEnabled: false,
            featureIdentifyResult: null
        })
        this.addStyleToFeature([])
    }
    addStyleToFeature = (features) => {
        this.state.featureCollection.clear()
        if (features && features.length > 0) {
            this.state.featureCollection.extend(features)
        }
    }
    handleFeatureStyleOnBack = () => {
        const { featureIdentifyResult, selectionModeEnabled } = this.state
        if (selectionModeEnabled) {
            this.addStyleToFeature(featureIdentifyResult)
        } else {
            this.addStyleToFeature([])
        }
    }
    backToList = () => {
        const { featureIdentifyResult, selectionModeEnabled } = this.state
        let selectionProperties = {
            selectionModeEnabled
        }
        if (featureIdentifyResult && featureIdentifyResult.length == 1) {
            selectionProperties.selectionModeEnabled = false
        }
        this.setState({
            detailsModeEnabled: false,
            detailsOfFeature: null,
            ...selectionProperties
        }, this.handleFeatureStyleOnBack)
    }
    openDetails = (newState) => {
        this.setState({ ...this.state, ...newState }, () => {
            this.addStyleToFeature([newState.detailsOfFeature])
            this.zoomToFeature(newState.detailsOfFeature)
        })
    }
    featureIdentify = (map, coordinate) => {
        const { config } = this.props
        const view = map.getView()
        const selectedLayer = LayersHelper.getWMSLayer(config.layer, map.getLayers()
            .getArray())
        let identifyPromises = [selectedLayer].map(
            (layer) => FeaturesHelper.readFeaturesThenTransform(
                this.urls, layer, coordinate, view, map))
        Promise.all(identifyPromises).then(result => {
            const featureIdentifyResult = result.reduce((array1,
                array2) => array1.concat(array2), [])
            this.setState({
                featureIdentifyLoading: false,
                featureIdentifyResult,
                activeFeature: null,
                detailsModeEnabled: false,
                detailsOfFeature: null,
            }, () => this.addStyleToFeature(
                featureIdentifyResult))
        })
    }
    render() {
        const { config, urls } = this.props
        let childrenProps = {
            config,
            ...this.state,
            getFeatures: this.getFeatures,
            searchFilesById: this.searchFilesById,
            zoomToFeature: this.zoomToFeature,
            addStyleToFeature: this.addStyleToFeature,
            backToAllFeatures: this.backToAllFeatures,
            search: this.search,
            addComment: this.addComment,
            searchCommentById: this.searchCommentById,
            urls,
            SaveImageBase64: this.SaveImageBase64,
            getImageFromURL: this.getImageFromURL,
            openDetails: this.openDetails,
            back: this.backToList,
            toggleDrawer: this.toggleDrawer
        }
        return <FeatureList childrenProps={childrenProps} map={this.state.map} />
    }
}
FeatureListContainer.propTypes = {
    urls: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
}
global.CartoviewFeatureList = {
    show: (el, props, urls) => {
        render(<FeatureListContainer urls={urls} config={props} />,
            document.getElementById(el))
    }
}
