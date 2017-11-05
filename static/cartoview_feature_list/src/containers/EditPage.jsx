import '../css/app.css'

import { doGet, doPost } from './utils'

import AppConfiguration from '../components/edit/AppConfiguration'
import EditPageComponent from '../components/edit/EditPage'
import FeatureListConfig from '../components/edit/FeatureListConfig'
import MapSelector from '../components/edit/MapSelector'
import PropTypes from 'prop-types'
import React from 'react'
import ToolConfiguration from '../components/edit/ToolConfiguration'
import URLS from './URLS'

const limit = 9
class EditPage extends React.Component {
    constructor(props) {
        super(props)
        this.urls = new URLS(this.props.urls)
        const { config } = this.props
        this.state = {
            maps: [],
            userMaps: true,
            selectedMap: config ? config.map : null,
            loading: false,
            mapLayers: [],
            totalMaps: 0,
            layerAttributes: [],
            title: config ? config.title : null,
            abstract: config ? config.abstract : null,
            config: config ? config.config : null,
            tags: [],
            keywords: [],
            saving: false,
            errors: [],
            instanceId: config ? config.id : null
        }
    }
    componentWillMount() {
        const { userMaps,selectedMap,config } = this.state
        this.getMaps(userMaps)
        if(selectedMap){
            this.getMapLayers()
        }
        if(config && config.layer){
            this.getAttributes(config.layer)
        }
        this.getKeywords()
        this.getTags()
    }
    UserMapsChanged = () => {
        const { userMaps } = this.state
        this.setState({ userMaps: !userMaps }, this.getMaps(!
            userMaps))
    }
    getMapLayers() {
        this.setState({ loading: true })
        const { urls } = this.props
        const { selectedMap } = this.state
        let url = urls.mapLayers
        url = this.urls.getParamterizedURL(url, { id: selectedMap.id })
        doGet(url).then(result => {
            this.setState({
                mapLayers: result.objects,
                loading: false
            })
        })
    }
    getMaps = (userMaps, offset = 0, limit = limit) => {
        this.setState({ loading: true })
        const { username } = this.props
        const url = this.urls.getMapApiURL(username, userMaps, limit,
            offset)
        doGet(url).then(result => {
            this.setState({
                maps: result.objects,
                loading: false,
                totalMaps: result.meta.total_count
            })
        })
    }
    searchMapById = (id) => {
        const { maps } = this.state
        let result = null
        for (let map of maps) {
            if (map.id === id) {
                result = map
                break
            }
        }
        return result
    }
    getAttributes = (typename) => {
        this.setState({ loading: true })
        const { urls } = this.props
        if (typename) {
            let url = urls.layerAttributes
            url = this.urls.getParamterizedURL(url, { 'layer__typename': typename })
            doGet(url).then(result => {
                this.setState({
                    layerAttributes: result.objects,
                    loading: false
                })
            })
        }
    }
    getKeywords = () => {
        this.setState({ loading: true })
        const { urls } = this.props
        const url = urls.keywordsAPI
        doGet(url).then(result => {
            this.setState({ keywords: result.objects, loading: false })
        })
    }
    getTags = () => {
        const { urls } = this.props
        doGet(urls.tagsAPI).then(result => {
            this.setState({ tags: result })
        })
    }
    selectMap = (map) => {
        this.setState({ selectedMap: map }, this.getMapLayers)
    }
    setStepRef = (name, ref) => {
        this[name] = ref
    }
    getSteps = () => {
        const {
            maps,
            loading,
            selectedMap,
            userMaps,
            totalMaps,
            mapLayers,
            layerAttributes,
            config,
            tags,
            title,
            abstract,
            keywords,
            instanceId
        } = this.state
        let steps = [
            {
                title: "Select Map",
                component: MapSelector,
                ref: 'mapStep',
                hasErrors: false,
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
                ref: 'featureListConfigurationStep',
                hasErrors: false,
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
                title: "General",
                component: AppConfiguration,
                ref: 'generalStep',
                hasErrors: false,
                props: {
                    abstract,
                    title,
                    selectedMap,
                    config,
                    allKeywords: keywords,
                    instanceId
                }
            },
            {
                title: "Navigation Tools",
                component: ToolConfiguration,
                ref: 'toolsStep',
                hasErrors: false,
                props: {
                    config,
                    save: this.save,
                    instanceId
                }
            }
        ]
        const { errors } = this.state
        errors.map(error => steps[error].hasError = true)
        return steps
    }
    toArray = (arrayOfStructs) => {
        let arr = []
        arrayOfStructs.forEach((struct) => {
            arr.push(struct.value)
        }, this)
        return arr
    }
    prepareServerData = () => {
        const keywords = this.generalStep.getComponentValue().keywords
        const tags = this.featureListConfigurationStep.getComponentValue().attachmentTags
        const { selectedMap } = this.state
        let finalConfiguration = {
            map: selectedMap.id,
            ...this.generalStep.getComponentValue(),
            config: {
                ...this.toolsStep.getComponentValue(),
                ...this.featureListConfigurationStep.getComponentValue()

            },
            keywords: this.toArray(keywords)

        }
        if (tags) {
            finalConfiguration.config.attachmentTags = this.toArray(tags)
        }

        return finalConfiguration

    }
    sendConfiguration = () => {
        this.setState({ saving: true })
        const { urls } = this.props
        const { instanceId, errors } = this.state
        if (errors.length == 0) {
            const url = instanceId ? urls.editURL(instanceId) : urls.newURL
            const data = JSON.stringify(this.prepareServerData())
            doPost(url, data, { "Content-Type": "application/json; charset=UTF-8" }).then(result => {
                this.setState({
                    instanceId: result.id,
                    saving: false
                })
                // window.location.href=urls.editURL(result.id)
            })

        }

    }
    showComponentsErrors = () => {
        let errors = []
        const steps = this.getSteps()
        steps.map((step, index) => {
            const formValue = this[step.ref].getComponentValue()
            if (!formValue) {
                errors.push(index)
            }
        })
        this.setState({ errors }, this.sendConfiguration)
    }
    save = () => {
        this.showComponentsErrors()

    }
    getChildrenProps = () => {
        const props = {
            ...this.state,
            ...this.props,
            steps: this.getSteps(),
            setStepRef: this.setStepRef,
            save: this.save
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
