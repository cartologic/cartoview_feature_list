/* eslint-disable flowtype/require-valid-file-annotation */
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation'

import ListIcon from 'material-ui-icons/List.js'
import PropTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'
const styles = {
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0
    },
}
class SimpleBottomNavigation extends React.Component {
    state = {
        value: 0,
    }
    handleChange = ( event, value ) => {
        this.setState( { value } )
    }
    render( ) {
        const { classes } = this.props
        const { value } = this.state
        return (
            <BottomNavigation
        value={value}
        onChange={this.handleChange}
        showLabels
        className={classes.root}
      >
        <BottomNavigationButton label="All Features" icon={<ListIcon />} />
      </BottomNavigation>
        )
    }
}
SimpleBottomNavigation.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles( styles )( SimpleBottomNavigation )
