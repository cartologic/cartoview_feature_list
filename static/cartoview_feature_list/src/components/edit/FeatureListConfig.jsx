import 'react-select/dist/react-select.css'

import { Loader } from './MapSelector'
import PropTypes from 'prop-types'
import React from 'react'
import {
    getKeywordsTemplate
} from './AutoCompleteInput'
import { listConfigFormSchema } from '../../containers/forms'
import t from 'tcomb-form'

const Form = t.form.Form
export const getPropertyFromConfig = (config, property, defaultValue) => {
    const propertyValue = config && config[property] ? config[property] : defaultValue
    const nestedPropertyValue = config && config.config && config.config[property] ?
        config.config[property] : propertyValue
    return nestedPropertyValue
}
export default class FeatureListConfig extends React.Component {
    constructor(props) {
        super(props)
        const { mapLayers, config } = this.props
        this.state = {
            value: mapLayers.length > 0 ? this.getFormValue(config) : null,

        }
    }
    getTagsOptions = (input, callback) => {
        const { tags } = this.props
        let options=[]
        tags.forEach(tag => {
            options.push({
                label: tag.tag,
                value: tag.tag,
            })
        })
        callback(null, {
            options,
            complete: true
        })
    }
    getFormValue = (config) => {

        const value = {
            layer: getPropertyFromConfig(config, 'layer', null),
            titleAttribute: getPropertyFromConfig(config,
                'titleAttribute', null),
            subtitleAttribute: getPropertyFromConfig(config,
                'subtitleAttribute', null),
            pagination: getPropertyFromConfig(config,
                'pagination', "10"),
            filters: getPropertyFromConfig(config, 'filters', null),
            zoomOnSelect: getPropertyFromConfig(config,
                'zoomOnSelect', true),
            enableImageListView: getPropertyFromConfig(config,
                'enableImageListView', true),
            attachmentTags: getPropertyFromConfig(config, 'attachmentTags', null)
        }
        return value
    }
    componentWillReceiveProps(nextProps) {
        const { mapLayers } = this.props
        if (nextProps.mapLayers !== mapLayers) {
            this.setState({ value: this.getFormValue(nextProps.config) })
        }
    }
    getLayerOptions = () => {
        const { mapLayers } = this.props
        let options = []
        if (mapLayers && mapLayers.length > 0) {
            options = mapLayers.map(layer => {
                return { value: layer.typename, text: layer.name }
            })
        }
        return options
    }
    getAttributesOptions = (attributes) => {
        let options = []
        attributes.forEach((attribute) => {
            if (attribute.attribute_type.indexOf(
                "gml:") == -1) {
                options.push({
                    value: attribute.attribute,
                    text: attribute.attribute
                })
            }
        })
        return options
    }
    
    onChange = (newValue) => {
        const { getAttributes } = this.props
        const { value } = this.state
        if (!value.layer || (newValue.layer !== value.layer)) {
            this.setState({ value: newValue }, () => {
                if(newValue.layer){
                    getAttributes(newValue.layer)
                }
            } )
        }
    }
    getFormOptions = () => {
        const { layerAttributes } = this.props
        const attributeOptions = this.getAttributesOptions(layerAttributes)
        const options = {
            fields: {
                layer: {
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose Layer' },
                    options: this.getLayerOptions()
                },
                titleAttribute: {
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose Title Attribute' },
                    options: attributeOptions
                },
                subtitleAttribute: {
                    label: "Subtitle Attribute (optional)",
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose subTitle Attribute' },
                    options: attributeOptions
                },
                filters: {
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose Search Attribute' },
                    options: attributeOptions
                },
                pagination: {
                    factory: t.form.Select,
                    nullOption: { value: '', text: 'Choose number of Features' },
                    options: [
                        { value: '10', text: "10" },
                        { value: '20', text: "20" },
                        { value: '40', text: "40" },
                        { value: '80', text: "80" }
                    ]
                },
                attachmentTags: {
                    factory: t.form.Textbox,
                    template: getKeywordsTemplate({
                        loadOptions: this.getTagsOptions,
                        message:"Select or Enter a Tag"
                    })
                }
            }
        }
        return options
    }
    render() {
        const { loading } = this.props
        const { value } = this.state
        return (
            <div>
                <h3>{"Feature List Configuration"}</h3>
                {loading && <Loader />}
                {!loading && <Form
                    ref={(form) => this.form = form}
                    type={listConfigFormSchema()}
                    value={value}
                    onChange={this.onChange}
                    options={this.getFormOptions()} />}

            </div>
        )
    }
}
FeatureListConfig.propTypes = {
    mapLayers: PropTypes.array.isRequired,
    layerAttributes: PropTypes.array.isRequired,
    getAttributes: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    config: PropTypes.object,
    tags: PropTypes.array.isRequired
}