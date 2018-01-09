import '../../vendor/ol3-layerswitcher/src/ol3-layerswitcher.css'

import React, { Component } from 'react'

import ContentGrid from './ContentGrid'
import { MuiThemeProvider } from 'material-ui/styles'
import PropTypes from 'prop-types'
import { theme } from './theme.jsx'
import { upperPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        height: '100%'
    }
})
class FeatureList extends Component {
    render() {
        let { classes, map, childrenProps } = this.props
        return (
            <MuiThemeProvider theme={theme}>
                <div className={classes.root}>
                    <ContentGrid childrenProps={childrenProps} map={map} />
                </div>
            </MuiThemeProvider>
        )
    }
}
FeatureList.propTypes = {
    ...upperPropTypes,
    map: PropTypes.object.isRequired,
}
export default withStyles(styles)(FeatureList)
