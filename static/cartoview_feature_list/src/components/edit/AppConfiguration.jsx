import PropTypes from 'prop-types'
import React from 'react'
import { generalFormSchema } from '../../containers/forms'
import {
    getKeywordsTemplate
} from './AutoCompleteInput'
import { getPropertyFromConfig } from './FeatureListConfig'
import t from 'tcomb-form'
const Form = t.form.Form
export default class AppConfiguration extends React.Component {
    constructor(props) {
        super(props)
    }
    getKeywordsOptions = (input, callback) => {
        const { allKeywords } = this.props
        let keywordsOptions = []
        allKeywords.forEach(keyword => {
            keywordsOptions.push({
                label: keyword.name,
                value: keyword.name,
            })
        })
        callback(null, {
            options:keywordsOptions,
            complete: true
        })
    }
    getFormValue = () => {
        const { title, selectedMap, abstract, keywords, config } =
            this.props
        const value = {
            title: title ? title : selectedMap ? selectedMap.title : null,
            abstract: abstract ? abstract : selectedMap ?
                selectedMap.abstract : null,
            access: getPropertyFromConfig(config, 'access',
                'public'),
            keywords: keywords ? keywords : null,
        }
        return value
    }
    getFormOptions = () => {
        const options = {
            fields: {
                title: {
                    label: "App Title"
                },
                keywords: {
                    factory: t.form.Textbox,
                    template: getKeywordsTemplate({
                        loadOptions: this.getKeywordsOptions,
                        message: "Select or Enter a Keyword"
                    })
                }
            }
        }
        return options
    }
    render() {
        return (
            <div>
                <h3>{"General Configuration"}</h3>
                <Form
                    ref={(form) => this.form = form}
                    value={this.getFormValue()}
                    type={generalFormSchema()}
                    onChange={this.onChange}
                    options={this.getFormOptions()} />
            </div>
        )
    }
}
AppConfiguration.propTypes = {
    keywords: PropTypes.array,
    allKeywords: PropTypes.array.isRequired,
    selectedMap: PropTypes.object,
    config: PropTypes.object,
    title: PropTypes.string,
    abstract: PropTypes.string
}
