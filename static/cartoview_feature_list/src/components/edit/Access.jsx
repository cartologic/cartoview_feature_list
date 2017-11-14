import PropTypes from 'prop-types'
import React from 'react'
import { accessFormSchema } from '../../containers/forms'
import {
    getAttributesTemplate
} from './AutoCompleteInput'
import { getPropertyFromConfig } from './FeatureListConfig'
import { getSelectOptions } from '../../containers/staticMethods'
import t from 'tcomb-form'
const Form = t.form.Form
export default class AppAccess extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.getFormValue(this.props)
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { errors } = this.props
        if (nextProps.errors !== errors) {
            return false
        }
        return true
    }
    flattenedUsers = (users) => {
        return users.map(obj => obj.value)
    }
    getFormValueForSaving = (value) => {
        let data = {}
        Object.keys(value).map(attr => {
            const attributeValue = value[attr]
            data[attr] = attributeValue ? this.flattenedUsers(attributeValue) : null
        })
        return data
    }
    getComponentValue = () => {
        let value = this.form.getValue()
        if (value) {
            value = this.getFormValueForSaving(value)
        }
        return value
    }
    onChange = (newValue) => {
        this.setState({ value: newValue })
    }
    getFormValue = (props) => {
        const { config } = props
        const value = {
            whoCanView: getPropertyFromConfig(config ? config.access :
                null, 'whoCanView', null),
            whoCanChangeMetadata: getPropertyFromConfig(config ?
                config.access : null, 'whoCanChangeMetadata',
                null),
            whoCanDelete: getPropertyFromConfig(config ? config.access :
                null, 'whoCanDelete', null),
            whoCanChangeConfiguration: getPropertyFromConfig(
                config ? config.access : null,
                'whoCanChangeConfiguration', null),
        }
        return value
    }
    getFormOptions = () => {
        const { profiles } = this.props
        const userOptions = getSelectOptions(profiles, 'username')
        const options = {
            fields: {
                whoCanView: {
                    factory: t.form.Textbox,
                    template: getAttributesTemplate({
                        options: userOptions,
                        message: "Select Users or empty for anyone"
                    })
                },
                whoCanChangeMetadata: {
                    factory: t.form.Textbox,
                    template: getAttributesTemplate({
                        options: userOptions,
                        message: "Select Users or empty for owner(you) only"
                    })
                },
                whoCanDelete: {
                    factory: t.form.Textbox,
                    template: getAttributesTemplate({
                        options: userOptions,
                        message: "Select Users or empty for owner(you) only"
                    })
                },
                whoCanChangeConfiguration: {
                    factory: t.form.Textbox,
                    template: getAttributesTemplate({
                        options: userOptions,
                        message: "Select Users or empty for owner(you) only"
                    })
                },
            }
        }
        return options
    }
    render() {
        return (
            <div>
                <h3>{"Access Configuration"}</h3>
                <Form
                    ref={(form) => this.form = form}
                    value={this.state.value}
                    type={accessFormSchema()}
                    onChange={this.onChange}
                    options={this.getFormOptions()} />
            </div>
        )
    }
}
AppAccess.propTypes = {
    config: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    profiles: PropTypes.array.isRequired,
    errors: PropTypes.array.isRequired,
}
