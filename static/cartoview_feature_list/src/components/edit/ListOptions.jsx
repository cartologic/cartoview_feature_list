// import 'react-select/dist/react-select.css'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import t from 'tcomb-form'

const filter = t.struct({
    type: t.String,
    name: t.String
})
const formConfig = t.struct({
    layer: t.String,
    titleAttribute: t.String,
    subtitleAttribute: t.maybe(t.String),
    filters: t.maybe(t.String),
    pagination: t.String,
    zoomOnSelect: t.Boolean,
    enableImageListView: t.Boolean
})
const Form = t.form.Form
const getPropertyFromConfig = (config, property, defaultValue) => {
    const propertyValue = config[property] ? config[property] : defaultValue
    const nestedPropertyValue = config.config && config.config[property] ?
        config.config[property] : propertyValue
    return nestedPropertyValue
}
export default class ListOptions extends Component {
    constructor(props) {
        super(props)
        const { config } = this.props
        this.state = {
            layers: [],
            value: {
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
            },
            attributeOptions: [],
            attributes: [],
            loading: false
        }
    }
    loadAttributes = (typename) => {
        this.setState({ loading: true })
        if (typename) {
            fetch(this.props.urls.layerAttributes + "?layer__typename=" +
                typename).then((response) => response.json()).then(
                (data) => {
                    let options = []
                    data.objects.forEach((attribute) => {
                        if (attribute.attribute_type.indexOf(
                            "gml:") == -1) {
                            options.push({
                                value: attribute.attribute,
                                text: attribute.attribute
                            })
                        }
                    })
                    this.setState({
                        attributeOptions: options,
                        loading: false,
                        attributes: data.objects
                    })
                })
        }
    }
    loadLayers() {
        this.setState({ loading: true })
        fetch(this.props.urls.mapLayers + "?id=" + this.props.map.id).then(
            (response) => response.json()).then((data) => {
                this.setState({ layers: data.objects, loading: false })
            }).catch((error) => {
                console.error(error)
            })
    }
    getLayerOptions = () => {
        const { layers } = this.state
        let options = []
        if (layers && layers.length > 0) {
            options = layers.map(layer => {
                return { value: layer.typename, text: layer.name }
            })
        }
        return options
    }
    componentDidMount() {
        const { config } = this.props
        this.loadLayers()
        if (config && config.layer) {
            this.loadAttributes(config.layer)
        }
    }
    save = () => {
        const value = this.form.getValue()
        if (value) {
            this.props.onComplete({
                config: {
                    ...value
                }
            })
        }
    }
    onChange = (newValue) => {
        const { value } = this.state
        if (!value.layer && (newValue.layer !== value.layer)) {
            this.setState({ value: newValue }, () => this.loadAttributes(
                newValue.layer))
        }
    }
    getFormOptions = () => {
        let {
            attributeOptions,
        } = this.state
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
                }
            }
        }
        return options
    }
    render() {
        let {
            loading,
            value
        } = this.state
        const options = this.getFormOptions()
        return (
            <div className="row">
                <div className="row">
                    <div className="col-xs-5 col-md-4"></div>
                    <div className="col-xs-7 col-md-8">
                        {!loading && <button
                            style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
                            className="btn btn-primary btn-sm pull-right"
                            onClick={() => this.save()}>{"next "}
                            <i className="fa fa-arrow-right"></i>
                        </button>}
                        <button
                            style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
                            className="btn btn-primary btn-sm pull-right"
                            onClick={() => this.props.onPrevious()}>
                            <i className="fa fa-arrow-left"></i>{" Previous"}</button>
                    </div>
                </div>
                <div className="row" style={{
                    marginTop: "3%"
                }}>
                    <div className="col-xs-5 col-md-4">
                        <h4>{'Customize List'}</h4>
                    </div>
                </div>
                <hr></hr>
                {!loading && <Form
                    ref={(form) => this.form = form}
                    type={formConfig}
                    value={value}
                    onChange={this.onChange}
                    options={options} />}
                {loading && < Spinner name="line-scale-pulse-out" color="steelblue" />}
            </div>
        )
    }
}
ListOptions.propTypes = {
    onComplete: PropTypes.func.isRequired,
    onPrevious: PropTypes.func.isRequired,
    config: PropTypes.object,
    urls: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired
}
