import '../css/app.css'

import AppConfiguration from '../components/edit/AppConfiguration'
import EditPageComponent from '../components/edit/EditPage'
import FeatureListConfig from '../components/edit/FeatureListConfig'
import MapSelector from '../components/edit/MapSelector'
import PropTypes from 'prop-types'
import React from 'react'
import ToolConfiguration from '../components/edit/ToolConfiguration'
import URLS from './URLS'
import { doGet } from './utils'

const limit = 9
class EditPage extends React.Component {
    constructor( props ) {
        super( props )
        this.urls = new URLS( this.props.urls )
        const { config } = this.props
        this.state = {
            maps: [],
            userMaps: true,
            selectedMap: null,
            loading: false,
            mapLayers: [],
            totalMaps: 0,
            layerAttributes: [],
            title: config ? config.title : null,
            abstract: config ? config.abstract : null,
            config: config ? config.config : null,
            tags:[],
            keywords:[]
        }
    }
    componentWillMount() {
        const { userMaps } = this.state
        this.getMaps( userMaps )
        this.getKeywords()
        this.getTags()
    }
    UserMapsChanged = () => {
        const { userMaps } = this.state
        this.setState( { userMaps: !userMaps }, this.getMaps( !
            userMaps ) )
    }
    getMapLayers() {
        this.setState( { loading: true } )
        const { urls } = this.props
        const { selectedMap } = this.state
        let url = urls.mapLayers
        url = this.urls.getParamterizedURL( url, { id: selectedMap.id } )
        doGet( url ).then( result => {
            this.setState( {
                mapLayers: result.objects,
                loading: false
            } )
        } )
    }
    getMaps = ( userMaps, offset = 0, limit = limit ) => {
        this.setState( { loading: true } )
        const { username } = this.props
        const url = this.urls.getMapApiURL( username, userMaps, limit,
            offset )
        doGet( url ).then( result => {
            this.setState( { maps: result.objects, loading: false,
                totalMaps: result.meta.total_count } )
        } )
    }
    searchMapById = ( id ) => {
        const { maps } = this.state
        let result = null
        for ( let map of maps ) {
            if ( map.id === id ) {
                result = map
                break
            }
        }
        return result
    }
    getAttributes = ( typename ) => {
        this.setState( { loading: true } )
        const { urls } = this.props
        if ( typename ) {
            let url = urls.layerAttributes
            url = this.urls.getParamterizedURL( url, { 'layer__typename': typename } )
            doGet( url ).then( result => {
                this.setState( {
                    layerAttributes: result.objects,
                    loading: false
                } )
            } )
        }
    }
    getKeywords = () => {
        this.setState( { loading: true } )
        const { urls } = this.props
        const url = urls.keywordsAPI
        doGet( url ).then( result => {
            this.setState( { keywords: result.objects, loading: false } )
        } )
    }
    getTags = () => {
        const { urls } = this.props
        doGet( urls.tagsAPI ).then( result => {
            this.setState( { tags: result } )
        } )
    }
    selectMap = ( map ) => {
        this.setState( { selectedMap: map }, this.getMapLayers )
    }
    getSteps = () => {
        const { maps, loading, selectedMap, userMaps, totalMaps,
            mapLayers, layerAttributes, config,tags,title,abstract,keywords} = this.state
        const steps = [
            {
                title: "Select Map",
                component: MapSelector,
                ref:this.mapStep,
                props: {
                    maps,
                    selectedMap,
                    loading,
                    selectMap: this.selectMap,
                    getMaps: this.getMaps,
                    userMaps,
                    totalMaps,
                    UserMapsChanged: this.UserMapsChanged,
                    limit
                }
            },
            {
                title: "FeatureList Configuration",
                component: FeatureListConfig,
                ref:this.featureListConfigurationStep,
                props: {
                    mapLayers,
                    layerAttributes,
                    getAttributes: this.getAttributes,
                    loading,
                    config,
                    tags
                }
            },
            {
                title:"General",
                component: AppConfiguration,
                ref:this.generalStep,
                props: {
                    keywords: config && config.keywords ? config.keywords : null,
                    abstract,
                    title,
                    selectedMap,
                    config,
                    allKeywords:keywords,
                }
            },
            {
                title:"Navigation Tools",
                component: ToolConfiguration,
                ref:this.toolsStep,
                props: {
                    config

                }
            }
        ]
        return steps
    }
    getChildrenProps = () => {
        const props = { ...this.state,
            ...this.props,
            steps: this.getSteps()
        }
        return props
    }
    render() {
        return (
            <EditPageComponent childrenProps={this.getChildrenProps()} />
        )
    }
}
EditPage.propTypes = {
    urls: PropTypes.object.isRequired,
    config: PropTypes.object,
    username: PropTypes.string.isRequired
}
export default EditPage
