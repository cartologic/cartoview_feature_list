import 'openlayers/dist/ol.css'
import '../css/view.css'
import 'typeface-roboto'

import React, { Component } from 'react'
import {
    addSelectionLayer,
    flyTo,
    getAttachmentTags,
    getCenterOfExtent,
    getFeatureInfoUrl,
    getFilter,
    getFilterByName,
    getMap,
    getWMSLayer,
    layerName,
    layerNameSpace,
    wmsGetFeatureInfoFormats
} from './staticMethods'

import FeatureList from '../components/view/FeatureList'
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService'
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService'
import PropTypes from 'prop-types'
import URLS from './URLS'
import { getCRSFToken } from '../helpers/helpers.jsx'
import ol from 'openlayers'
import { render } from 'react-dom'
import { styleFunction } from './styling.jsx'
import { wfsQueryBuilder } from "../helpers/helpers.jsx"

class FeatureListContainer extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            mapIsLoading: false,
            featuresIsLoading: false,
            totalFeatures: 0,
            features: null,
            searchResultIsLoading: false,
            searchModeEnable: false,
            searchTotalFeatures: 0,
            searchResult: null,
            attachmentIsLoading: false,
            commentsIsLoading: false,
            attachments: null,
            comments: null,
            selectionModeEnabled: false,
            featureIdentifyLoading: false,
            featureIdentifyResult: null,
            activeFeatures: null,
            filterType: null,
            ImageBase64: null,
            detailsModeEnabled: false,
            detailsOfFeature: null
        }
        this.urls = new URLS( this.props.urls )
        this.map = getMap()
        this.featureCollection = new ol.Collection()
        addSelectionLayer( this.map, this.featureCollection, styleFunction )
    }
    readThenSave = ( file, featureId ) => {
        const { config } = this.props
        const { attachments } = this.state
        var reader = new FileReader()
        reader.readAsDataURL( file )
        reader.onload = () => {
            const apiData = {
                file: reader.result,
                file_name: `${featureId}.png`,
                username: config.username,
                is_image: true,
                feature_id: featureId,
                tags: getAttachmentTags( config )
            }
            this.saveAttachment( apiData ).then( result => {
                this.setState( {
                    attachments: [ ...
                        attachments, result ]
                } )
            } )
        }
        reader.onerror = ( error ) => {
            throw ( error )
        }
    }
    SaveImageBase64 = ( file, featureId ) => {
        this.readThenSave( file, featureId )
    }
    getImageFromURL = ( url, featureId ) => {
        const proxiedURL = this.urls.getProxiedURL( url )
        fetch( proxiedURL, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Accept": "image/*"
            }
        } ).then( response => response.blob() ).then( blob => {
            this.readThenSave( blob, featureId )
        } )
    }
    addComment = ( data ) => {
        const { urls, config } = this.props
        const apiData = { ...data, username: config.username }
        const { comments } = this.state
        const url = urls.commentsUploadUrl( layerName( config.layer ) )
        return fetch( url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers( {
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            } ),
            body: JSON.stringify( apiData )
        } ).then( ( response ) => response.json() ).then( result => {
            this.setState( { comments: [ ...comments, result ] } )
        } )
    }
    getFilterType = () => {
        const { urls, config } = this.props
        fetch( `${urls.layerAttributes}?layer__typename=${config.layer}`, {
            method: "GET",
            credentials: 'include'
        } ).then( ( response ) => response.json() ).then( ( data ) => {
            const filterType = getFilterByName( data.objects,
                config.filters ).split( ":" ).pop()
            this.setState( { filterType } )
        } ).catch( ( error ) => {
            throw Error( error )
        } )
    }
    componentWillMount() {
        const { urls, config } = this.props
        if ( config.filters ) {
            this.getFilterType()
        }
        this.loadMap( urls.mapJsonUrl, urls.proxy )
        this.getFeatures( 0 )
        this.setAttachmentCommentsLoading( true )
        this.getCommentsAndFiles().then( ( [ attachments, comments ] ) => {
            this.setState( { attachments, comments }, this.setAttachmentCommentsLoading(
                false ) )
        } )
    }
    setAttachmentCommentsLoading = ( loading ) => {
        this.setState( { attachmentIsLoading: loading, commentsIsLoading: loading } )
    }
    searchFilesById = ( id ) => {
        const { attachments } = this.state
        let result = []
        attachments.map( ( imageObj ) => {
            if ( imageObj.is_image && imageObj.feature_id === id ) {
                result.push( imageObj )
            }
        } )
        return result
    }
    searchCommentById = ( id ) => {
        const { comments } = this.state
        let result = []
        comments.map( ( comment ) => {
            if ( comment.feature_id === id ) {
                result.push( comment )
            }
        } )
        return result
    }
    componentDidMount() {
        this.singleClickListner()
    }
    loadMap = ( mapUrl, proxyURL ) => {
        this.setState( { mapIsLoading: true } )
        fetch( mapUrl, {
            method: "GET",
            credentials: 'include'
        } ).then( ( response ) => {
            return response.json()
        } ).then( ( config ) => {
            if ( config ) {
                MapConfigService.load( MapConfigTransformService.transform(
                    config ), this.map, proxyURL )
                this.setState( { mapIsLoading: false } )
            }
        } ).catch( ( error ) => {
            throw Error( error )
        } )
    }
    getCRS = ( crs ) => {
        let promise = new Promise( ( resolve, reject ) => {
            if ( proj4.defs( 'EPSG:' + crs ) ) {
                resolve( crs )
            } else {
                fetch( "https://epsg.io/?format=json&q=" + crs ).then(
                    response => response.json() ).then(
                    projres => {
                        proj4.defs( 'EPSG:' + crs, projres.results[
                            0 ].proj4 )
                        resolve( crs )
                    } )
            }
        } )
        return promise
    }
    getFeatures = ( startIndex ) => {
        let { totalFeatures } = this.state
        const { urls, config } = this.props
        this.setState( { featuresIsLoading: true } )
        const requestUrl = wfsQueryBuilder( urls.wfsURL, {
            service: 'wfs',
            version: '2.0.0',
            request: 'GetFeature',
            typeNames: config.layer,
            outputFormat: 'json',
            srsName: this.map.getView().getProjection().getCode(),
            count: parseInt( config.pagination ),
            startIndex
        } )
        fetch( this.urls.getProxiedURL( requestUrl ) ).then( ( response ) =>
            response.json() ).then(
            ( data ) => {
                this.setState( { featuresIsLoading: false } )
                let features = new ol.format.GeoJSON().readFeatures(
                    data, {
                        featureProjection: this.map.getView().getProjection()
                    } )
                const total = data.totalFeatures
                if ( totalFeatures == 0 ) {
                    this.setState( { totalFeatures: total } )
                }
                this.setState( { features } )
            } )
    }
    search = ( text ) => {
        /* 
        Openlayer build request to avoid errors
        undefined passed to filter to skip paramters and
        use default values
        */
        const { urls, config } = this.props
        const { filterType } = this.state
        this.setState( { searchResultIsLoading: true, searchModeEnable: true } )
        var request = new ol.format.WFS().writeGetFeature( {
            srsName: this.map.getView().getProjection().getCode(),
            featureNS: 'http://www.geonode.org/',
            featurePrefix: layerNameSpace( config.layer ),
            outputFormat: 'application/json',
            featureTypes: [ layerName( config.layer ) ],
            filter: getFilter( config, filterType, text ),
            maxFeatures: 20
        } )
        return fetch( this.urls.getProxiedURL( urls.wfsURL ), {
            method: 'POST',
            credentials: 'include',
            headers: {
                "X-CSRFToken": getCRSFToken()
            },
            body: new XMLSerializer().serializeToString( request )
        } ).then( ( response ) => {
            this.setState( { searchResultIsLoading: false } )
            return response.json()
        } )
    }
    loadAttachments = ( attachmentURL ) => {
        const proxiedURL = this.urls.getProxiedURL( attachmentURL )
        return fetch( proxiedURL ).then( ( response ) => response.json() )
    }
    getCommentsAndFiles = () => {
        const { config, urls } = this.props
        const typename = layerName( config.layer )
        const filesURL = urls.attachmentUploadUrl( typename )
        const commentsURL = urls.commentsUploadUrl( typename )
        return Promise.all( [ this.loadAttachments( filesURL ), this.loadAttachments(
            commentsURL ) ] )
    }
    saveAttachment = ( data ) => {
        const { urls, config } = this.props
        const url = urls.attachmentUploadUrl( layerName( config.layer ) )
        return fetch( url, {
            method: 'POST',
            credentials: "same-origin",
            headers: new Headers( {
                "Content-Type": "application/json; charset=UTF-8",
                "X-CSRFToken": getCRSFToken()
            } ),
            body: JSON.stringify( data )
        } ).then( ( response ) => response.json() )
    }
    zoomToFeature = ( feature ) => {
        const { config } = this.props
        if ( config && config.zoomOnSelect ) {
            const featureCenter = feature.getGeometry().getExtent()
            const center = getCenterOfExtent( featureCenter )
            flyTo( center, this.map.getView(), 14, () => {} )
            /*
                this.map.getView().fit(feature.getGeometry().getExtent(),
                this.map.getSize(), { duration: 10000 })
            */
        }
    }
    singleClickListner = () => {
        this.map.on( 'singleclick', ( e ) => {
            this.setState( {
                featureIdentifyLoading: true,
                activeFeatures: null,
                featureIdentifyResult: null,
                selectionModeEnabled: true
            } )
            document.body.style.cursor = "progress"
            this.featureIdentify( this.map, e.coordinate )
        } )
    }
    backToAllFeatures = () => {
        this.setState( {
            selectionModeEnabled: false,
            featureIdentifyResult: null
        } )
        this.addStyleToFeature( [] )
    }
    transformFeatures = ( layer, features, map, crs ) => {
        let transformedFeatures = []
        features.forEach( ( feature ) => {
            feature.getGeometry().transform( 'EPSG:' + crs, map.getView()
                .getProjection() )
            feature.set( "_layerTitle", layer.get( 'title' ) )
            transformedFeatures.push( feature )
        } )
        let featureDetails = {
            detailsModeEnabled: false,
            detailsOfFeature: null,
        }
        if ( transformedFeatures.length == 1 ) {
            featureDetails.detailsModeEnabled = true
            featureDetails.detailsOfFeature = transformedFeatures[ 0 ]
        }
        this.setState( {
            featureIdentifyResult: transformedFeatures,
            activeFeatures: null,
            ...featureDetails,
            featureIdentifyLoading: false
        }, () => this.addStyleToFeature( this.state.featureIdentifyResult ) )
        document.body.style.cursor = "default"
    }
    addStyleToFeature = ( features ) => {
        this.featureCollection.clear()
        if ( features && features.length > 0 ) {
            this.featureCollection.extend( features )
        }
    }
    handleFeatureStyleOnBack = () => {
        const { featureIdentifyResult, selectionModeEnabled } = this.state
        if ( selectionModeEnabled ) {
            this.addStyleToFeature( featureIdentifyResult )
        } else {
            this.addStyleToFeature( [] )
        }
    }
    backToList = () => {
        const { featureIdentifyResult, selectionModeEnabled } = this.state
        let selectionProperties={
            selectionModeEnabled
        }
        if(featureIdentifyResult&&featureIdentifyResult.length==1){
            selectionProperties.selectionModeEnabled=false
        }
        this.setState( { detailsModeEnabled: false, detailsOfFeature: null,...selectionProperties },
            this.handleFeatureStyleOnBack )
    }
    openDetails = ( newState ) => {
        this.setState( { ...this.state, ...newState }, () => {
            this.addStyleToFeature( [ newState.detailsOfFeature ] )
            this.zoomToFeature( newState.detailsOfFeature )
        } )
    }
    featureIdentify = ( map, coordinate ) => {
        const { config } = this.props
        const view = map.getView()
        const layer = getWMSLayer( config.layer, this.map.getLayers().getArray() )
        const url = getFeatureInfoUrl( layer, coordinate, view,
            'application/json' )
        fetch( this.urls.getProxiedURL( url ) ).then( ( response ) =>
            response.json() ).then(
            ( result ) => {
                if ( result.features.length > 0 ) {
                    const features = wmsGetFeatureInfoFormats[
                        'application/json' ].readFeatures( result )
                    const crs = result.features.length > 0 ? result.crs
                        .properties.name.split( ":" ).pop() : null
                    this.getCRS( crs ).then( ( newCRS ) => {
                        this.transformFeatures( layer,
                            features, map, newCRS )
                    }, ( error ) => {
                        throw ( error )
                    } )
                } else {
                    this.setState( {
                        featureIdentifyResult: [],
                        activeFeatures: null,
                        detailsModeEnabled: false,
                        detailsOfFeature: null,
                        featureIdentifyLoading: false
                    } )
                    document.body.style.cursor = "default"
                }
            } )
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
            layerName,
            layerNameSpace,
            search: this.search,
            addComment: this.addComment,
            searchCommentById: this.searchCommentById,
            urls,
            SaveImageBase64: this.SaveImageBase64,
            getImageFromURL: this.getImageFromURL,
            openDetails: this.openDetails,
            back: this.backToList
        }
        return <FeatureList childrenProps={childrenProps} map={this.map} />
    }
}
FeatureListContainer.propTypes = {
    urls: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired
}
global.CartoviewFeatureList = {
    show: ( el, props, urls ) => {
        render( <FeatureListContainer urls={urls} config={props} />,
            document.getElementById( el ) )
    }
}
