import PropTypes from 'prop-types'
import React from 'react'
import { getPropertyFromConfig } from './FeatureListConfig'
import t from 'tcomb-form'
import { toolFormSchema } from '../../containers/forms'
const options = {
    fields: {
        showZoombar: {
            label: "Zoom Bar"
        },
        showLayerSwitcher: {
            label: "Layer Switcher"
        },
        showBaseMapSwitcher: {
            showBaseMapSwitcher: "Base Map Switcher"
        },
        showLegend: {
            label: "Legend"
        }
    }
}
const Form = t.form.Form
export default class ToolConfiguration extends React.Component {
    constructor( props ) {
        super( props )
    }
    getFormValue = () => {
        const { config } = this.props
        const value = {
            showZoombar: getPropertyFromConfig( config,
                'showZoombar', true ),
            showLayerSwitcher: getPropertyFromConfig( config,
                'showLayerSwitcher', true ),
            showBaseMapSwitcher: getPropertyFromConfig( config,
                'showBaseMapSwitcher', true ),
            showLegend: getPropertyFromConfig( config,
                'showLegend', true )
        }
        return value
    }
    render() {
        return (
            <div>
                <h3>{"Navigation Tools"}</h3>
				<Form
					ref={(formRef) => this.form = formRef}
					value={this.getFormValue()}
					type={toolFormSchema()}
					options={options} />
			</div>
        )
    }
}
ToolConfiguration.propTypes = {
    config: PropTypes.object
}
