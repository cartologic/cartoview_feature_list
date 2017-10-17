// import 'react-select/dist/react-select.css'
import React, { Component } from 'react'

import PropTypes from 'prop-types'
import Select from 'react-select'
import t from 'tcomb-form'

const Form = t.form.Form
const paginationOptions = t.enums( {
    public: 'Public',
    private: 'Private'
} );
export default class ListOptions extends Component {
    constructor( props ) {
        super( props )
        this.state = {
            layers: [],
            value: {
                layer: this.props.config ? this.props.config.layer : null,
                titleAttribute: this.props.config ? this.props.config.titleAttribute : null,
                subtitleAttribute: this.props.config ? this.props.config
                    .subtitleAttribute : null,
                pagination: this.props.config ? this.props.config.pagination : null,
                filters: this.props.config ? this.props.config.filters : null,
            },
            attributeOptions: [],
            loading: false
        }
    }
    loadAttributes = ( typename ) => {
        if ( typename ) {
            fetch( this.props.urls.layerAttributes + "?layer__typename=" +
                typename ).then( ( response ) => response.json() ).then(
                ( data ) => {
                    let options = []
                    data.objects.forEach( ( attribute ) => {
                        if ( attribute.attribute_type.indexOf(
                                "gml:" ) == -1 ) {
                            options.push( {
                                value: attribute.attribute,
                                text: attribute.attribute
                            } )
                        }
                    } )
                    this.setState( { attributeOptions: options } )
                } )
        }
    }
    loadLayers() {
        fetch( this.props.urls.mapLayers + "?id=" + this.props.map.id ).then(
            ( response ) => response.json() ).then( ( data ) => {
            this.setState( { layers: data.objects, loading: false } )
        } ).catch( ( error ) => {
            console.error( error )
        } )
    }
    getLayerOptions = () => {
        const { layers } = this.state
        let options = []
        if ( layers && layers.length > 0 ) {
            options = layers.map( layer => {
                return { value: layer.typename, text: layer.name }
            } )
        }
        return options
    }
    componentDidMount() {
        const { config } = this.props
        this.loadLayers()
        if ( config && config.layer ) {
            this.loadAttributes( config.layer )
        }
    }
    save = () => {
        const value = this.form.getValue()
        if ( value ) {
            this.props.onComplete( {
                config: { ...value
                }
            } )
        }
    }
    onChange = ( value ) => {
        if ( value.layer ) {
            this.setState( { value: value }, () => this.loadAttributes(
                value.layer ) )
        }
    }
    render() {
        let {
            loading,
            attributeOptions,
            value
        } = this.state
        let formConfig = t.struct( {
            layer: t.String,
            titleAttribute: t.String,
            subtitleAttribute: t.String,
            filters: t.String,
            pagination: t.String
        } )
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
        return (
            <div className="row">
                <div className="row">
                    <div className="col-xs-5 col-md-4"></div>
                    <div className="col-xs-7 col-md-8">
                        <button
                            style={{
                                display: "inline-block",
                                margin: "0px 3px 0px 3px"
                            }}
                            className="btn btn-primary btn-sm pull-right"
                            onClick={()=>this.save()}>{"next "}
                            <i className="fa fa-arrow-right"></i>
                        </button>
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
                <Form
                    ref={(form) => this.form = form}
                    type={formConfig}
                    value={value}
                    onChange={this.onChange}
                    options={options} />
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
