import '../css/app.css'

import { doGet, doPost } from './utils'

import AppAccess from '../components/edit/Access'
import AppConfiguration from '../components/edit/AppConfiguration'
import EditPageComponent from '../components/edit/EditPage'
import FeatureDetailsPanel from '../components/edit/FeatureDetailsPanel'
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
            profiles:[],
            instanceId: config ? config.id : null,
            searchEnabled: false
        }
    }
    componentWillMount() {
        const { selectedMap, config } = this.state
        this.getMaps()
        if (selectedMap) {
            this.getMapLayers()
        }
        if (config && config.layer) {
            this.getAttributes(config.layer)
        }
        this.getKeywords()
        this.getProfiles()
        this.getTags()
    }
    UserMapsChanged = () => {
        const { userMaps } = this.state
        this.setState({ userMaps: !userMaps }, this.getMaps)
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
    getMaps = (offset = 0, limit = limit) => {
        this.setState({ loading: true })
        const { username } = this.props
        const { userMaps } = this.state
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
    handleSearchMode = (bool) => {
        this.setState({ searchEnabled: bool })
    }
    search = (text) => {
        this.setState({ loading: true, searchEnabled: true })
        const { username } = this.props
        const { userMaps } = this.state
        const url = this.urls.getMapApiSearchURL(username, userMaps, text)
        doGet(url).then(result => {
            this.setState({
                maps: result.objects,
                loading: false
            })
        })
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
    getProfiles = () => {
        this.setState({ loading: true })
        const { urls } = this.props
        const url = urls.profilesAPI
        doGet(url).then(result => {
            this.setState({ profiles: result.objects, loading: false })
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
            instanceId,
            searchEnabled,
            profiles
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
                    limit,
                    search: this.search,
                    handleSearchMode: this.handleSearchMode,
                    searchEnabled
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
                title: "Feature Details Configuration",
                component: FeatureDetailsPanel,
                ref: 'featureDetailsConfigurationStep',
                hasErrors: false,
                props: {
                    layerAttributes,
                    loading,
                    config,
                    tags
                }
            },
            {
                title: "Acccess Configuration",
                component: AppAccess,
                ref: 'accessConfigurationStep',
                hasErrors: false,
                props: {
                    loading,
                    config,
                    profiles,
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
        if (arrayOfStructs) {
            arrayOfStructs.forEach((struct) => {
                arr.push(struct.value)
            }, this)
        }
        return arr
    }
    prepareServerData = () => {
        const keywords = this.generalStep.getComponentValue().keywords
        let tags = this.featureDetailsConfigurationStep.getComponentValue().attachmentTags
        let attributes = this.featureDetailsConfigurationStep.getComponentValue().attributesToDisplay
        const { selectedMap } = this.state
        let finalConfiguration = {
            map: selectedMap.id,
            ...this.generalStep.getComponentValue(),
            config: {
                ...this.toolsStep.getComponentValue(),
                ...this.featureListConfigurationStep.getComponentValue()

            },
            access:this.accessConfigurationStep.getComponentValue(),
            keywords: this.toArray(keywords)

        }
        tags = this.toArray(tags)
        attributes = this.toArray(attributes)
        finalConfiguration.config.attachmentTags = tags
        finalConfiguration.config.attributesToDisplay = attributes

        return finalConfiguration

    }
    sendConfiguration = () => {
        const { urls } = this.props
        const { instanceId, errors } = this.state
        if (errors.length == 0) {
            this.setState({ saving: true })
            const url = instanceId ? urls.editURL(instanceId) : urls.newURL
            const data = JSON.stringify(this.prepareServerData())
            doPost(url, data, { "Content-Type": "application/json; charset=UTF-8" }).then(result => {
                this.setState({
                    instanceId: result.id,
                    saving: false
                })
            })

        }

    }
    showComponentsErrors = (callBack) => {
        let errors = []
        const steps = this.getSteps()
        steps.map((step, index) => {
            const formValue = this[step.ref].getComponentValue()
            if (!formValue) {
                errors.push(index)
            }
        })
        this.setState({ errors }, callBack)
    }
    save = () => {
        this.showComponentsErrors(this.sendConfiguration)

    }
    validate = () => {
        this.showComponentsErrors(() => { })
    }
    getChildrenProps = () => {
        const props = {
            ...this.state,
            ...this.props,
            steps: this.getSteps(),
            setStepRef: this.setStepRef,
            save: this.save,
            validate: this.validate
        }
        return props
    }
    render() {
        return (
            <div>
                <EditPageComponent childrenProps={this.getChildrenProps()} />
            </div>
        )
    }
}
EditPage.propTypes = {
    urls: PropTypes.object.isRequired,
    config: PropTypes.object,
    username: PropTypes.string.isRequired
}
export default EditPage
