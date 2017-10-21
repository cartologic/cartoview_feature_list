import React, { Component } from 'react'
import {
    addSelectionLayer,
    getFeatureInfoUrl,
    getMap,
    getWMSLayer,
    wmsGetFeatureInfoFormats
} from './staticMethods'

import FeatureList from '../components/view/FeatureList'
import MapConfigService from '@boundlessgeo/sdk/services/MapConfigService'
import MapConfigTransformService from '@boundlessgeo/sdk/services/MapConfigTransformService'
import PropTypes from 'prop-types'
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
            attachments: null,
            selectionModeEnabled: false,
            featureIdentifyLoading: false,
            featureIdentifyResult: null,
            activeFeatures: null,
            filterType: null
        }
        this.map = getMap()
        this.featureCollection = new ol.Collection()
        addSelectionLayer( this.map, this.featureCollection, styleFunction )
    }
    getFilterByName = ( attrs, attrName ) => {
        let attributeType = null
        if ( attrs ) {
            attrs.forEach( attr => {
                if ( attr.attribute === attrName ) {
                    attributeType = attr.attribute_type
                }
            } )
        }
        return attributeType
    }
    getFilterType = () => {
        const { urls, config } = this.props
        fetch(
            `${urls.layerAttributes}?layer__typename=${config.layer}`, {
                method: "GET",
                credentials: 'include'
            } ).then( ( response ) => response.json() ).then( ( data ) => {
            const filterType = this.getFilterByName( data.objects,
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
        this.loadAttachments( urls.attachmentUploadUrl( this.layerName(
            config.layer ) ) )
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
    layerName = ( typeName ) => {
        return typeName.split( ":" ).pop()
    }
    layerNameSpace = ( typeName ) => {
        return typeName.split( ":" )[ 0 ]
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
        fetch( requestUrl ).then( ( response ) => response.json() ).then(
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
    getFilter = ( value ) => {
        /* 
        this function should return the proper filter based on 
        filter type
        working with strings & numbers
        test Needed
        */
        const { config } = this.props
        const { filterType } = this.state
        if ( filterType !== 'string' ) {
            return ol.format.filter.equalTo( config.filters, value )
        } else {
            return ol.format.filter.like( config.filters, '%' + value +
                '%', undefined, undefined, undefined, false )
        }
    }
    search = ( text ) => {
        /* 
        Openlayer build request to avoid errors
        undefined passed to filter to skip paramters and
        use default values
        */
        const { urls, config } = this.props
        let { searchTotalFeatures } = this.state
        this.setState( { searchResultIsLoading: true, searchModeEnable: true } )
        var request = new ol.format.WFS().writeGetFeature( {
            srsName: this.map.getView().getProjection().getCode(),
            featureNS: 'http://www.geonode.org/',
            featurePrefix: this.layerNameSpace( config.layer ),
            outputFormat: 'application/json',
            featureTypes: [ this.layerName( config.layer ) ],
            filter: this.getFilter( text ),
            maxFeatures: 20
        } )
        return fetch( urls.wfsURL, {
            method: 'POST',
            credentials: 'include',
            body: new XMLSerializer().serializeToString( request )
        } ).then( ( response ) => {
            return response.json()
        } )
    }
    loadAttachments = ( attachmentURL ) => {
        this.setState( { attachmentIsLoading: true } )
        fetch( attachmentURL ).then( ( response ) => response.json() ).then(
            ( data ) => {
                this.setState( {
                    attachmentIsLoading: false,
                    attachments: data
                } )
            } ).catch( ( error ) => {
            throw Error( error )
        } )
    }
    zoomToFeature = ( feature ) => {
        const { config } = this.props
        if ( config && config.zoomOnSelect ) {
            this.map.getView().fit( feature.getGeometry().getExtent(),
                this.map.getSize(), { duration: 10000 } )
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
        this.setState( {
            featureIdentifyResult: transformedFeatures,
            activeFeatures: null,
            featureIdentifyLoading: false
        },()=>this.addStyleToFeature( this.state.featureIdentifyResult ) )
        document.body.style.cursor = "default"

    }
    addStyleToFeature = ( features ) => {
        this.featureCollection.clear()
        if ( features && features.length > 0 ) {
            this.featureCollection.extend( features )
        }
    }
    featureIdentify = ( map, coordinate ) => {
        const { config } = this.props
        const view = map.getView()
        const layer = getWMSLayer( config.layer, this.map.getLayers().getArray() )
        const url = getFeatureInfoUrl( layer, coordinate, view,
            'application/json' )
        fetch( url ).then( ( response ) => response.json() ).then(
            ( result ) => {
                if ( result.features.length > 0 ) {
                    const features = wmsGetFeatureInfoFormats[
                        'application/json' ].readFeatures( result )
                    const crs = result.features.length > 0 ? result.crs
                        .properties.name.split( ":" ).pop() : null
                    if ( proj4.defs( 'EPSG:' + crs ) ) {
                        this.transformFeatures( layer, features, map,
                            crs )
                    } else {
                        fetch( "https://epsg.io/?format=json&q=" + crs )
                            .then( response => response.json() ).then(
                                projres => {
                                    proj4.defs( 'EPSG:' + crs, projres
                                        .results[ 0 ].proj4 )
                                    this.transformFeatures( layer,
                                        features, map, crs )
                                } )
                    }
                } else {
                    this.setState( {
                        featureIdentifyResult: [],
                        activeFeatures: null,
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
            layerName: this.layerName,
            layerNameSpace: this.layerNameSpace,
            search: this.search,
            urls
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
