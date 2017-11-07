import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import Drawer from 'material-ui/Drawer';
import GridIcon from 'material-ui-icons/GridOn'
import IconButton from 'material-ui/IconButton'
import LayerIcon from 'material-ui-icons/Layers'
import ListIcon from 'material-ui-icons/List'
import MapIcon from 'material-ui-icons/Map'
import MenuIcon from 'material-ui-icons/Menu'
import PropTypes from 'prop-types'
import React from 'react'
import { parentProptypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    button: {
        marginLeft: "auto",
        marginRight: "auto",
        height: "100% !important"
    },
})
class NavigationMenu extends React.Component {
    state = {
        open: false,
    }
    handleClick = () => {
        const {open}=this.state
        this.setState({ open: !open })
    }
    handleRequestClose = (e, url) => {
        if (typeof (url) !== "undefined") {
            window.location.href = url
        }
        this.handleClick()
    }
    render() {
        const { classes, urls } = this.props
        return (
            <div>
                <IconButton
                    aria-owns={this.state.open ? 'nav-menu' : null}
                    onClick={this.handleClick}
                    className={classes.button}
                    aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor="right"
                    open={this.state.open}
                    onRequestClose={() => this.handleClick()}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.handleClick}
                        onKeyDown={this.handleClick}>
                        <List>
                            <ListItem onClick={(e) => this.handleRequestClose(e, urls.appInstancesPage)} button>
                                <ListItemIcon>
                                    <ListIcon className={classes.button} />
                                </ListItemIcon>
                                <ListItemText primary="All FeatureList apps" />
                            </ListItem >
                            <ListItem onClick={(e) => this.handleRequestClose(e, urls.layers)} button>
                                <ListItemIcon>
                                    <LayerIcon className={classes.button} />
                                </ListItemIcon>
                                <ListItemText primary="Layers" />
                            </ListItem>
                            <ListItem onClick={(e) => this.handleRequestClose(e, urls.maps)} button>
                                <ListItemIcon>
                                    <MapIcon className={classes.button} />
                                </ListItemIcon>
                                <ListItemText primary="Maps" />
                            </ListItem>
                            <ListItem onClick={(e) => this.handleRequestClose(e, urls.apps)} button>
                                <ListItemIcon>
                                    <GridIcon className={classes.button} />
                                </ListItemIcon>
                                <ListItemText primary="Apps" />
                            </ListItem>
                        </List>
                    </div>
                </Drawer>
            </div>
        )
    }
}
NavigationMenu.propTypes = {
    ...parentProptypes,
    classes: PropTypes.object.isRequired,
    urls: PropTypes.object.isRequired,
}
export default withStyles(styles)(NavigationMenu)
