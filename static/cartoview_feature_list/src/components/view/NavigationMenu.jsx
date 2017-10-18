import Menu, { MenuItem } from 'material-ui/Menu'

import GridIcon from 'material-ui-icons/GridOn'
import IconButton from 'material-ui/IconButton'
import LayerIcon from 'material-ui-icons/Layers'
import MapIcon from 'material-ui-icons/Map'
import MenuIcon from 'material-ui-icons/MoreVert'
import ProtoTypes from 'prop-types'
import React from 'react'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
})
class NavigationMenu extends React.Component {
    state = {
        open: false,
    }
    handleClick = event => {
        this.setState({ open: true, anchorEl: event.currentTarget })
    }
    handleRequestClose = (url) => {
        this.setState({ open: false })
        if(typeof(url)==="undefined"){
            window.location.href=url
        }
        
    }
    render() {
        const { classes,urls } = this.props
        return (
            <div>
                <IconButton
                    aria-owns={this.state.open ? 'nav-menu' : null}
                    onClick={this.handleClick}
                    className={classes.button}
                    aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="nav-menu"
                    anchorEl={this.state.anchorEl}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose}
                >
                    <MenuItem onClick={()=>this.handleRequestClose(urls.layers)}><LayerIcon className={classes.button} /> Layers</MenuItem>
                    <MenuItem onClick={()=>this.handleRequestClose(urls.maps)}><MapIcon className={classes.button} /> Maps</MenuItem>
                    <MenuItem onClick={()=>this.handleRequestClose(urls.apps)}><GridIcon className={classes.button} /> Apps</MenuItem>
                </Menu>
            </div>
        );
    }
}
NavigationMenu.protoTypes = {
    classes: ProtoTypes.object.isRequired
}
export default withStyles(styles)(NavigationMenu)
