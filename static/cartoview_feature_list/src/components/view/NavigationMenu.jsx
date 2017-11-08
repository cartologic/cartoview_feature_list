import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';

import ArrowBack from 'material-ui-icons/ArrowBack'
import Divider from 'material-ui/Divider'
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
        const { open } = this.state
        this.setState({ open: !open })
    }
    handleRequestClose = (e, url) => {
        if (typeof (url) !== "undefined") {
            window.location.href = url
        }
        this.handleClick()
    }
    shouldComponentUpdate(nextProps, nextState) {
        const { classes, urls } = this.props
        const { open } = this.state
        if (urls === nextProps.urls && classes === nextProps.classes && nextState.open === open) {
            return false
        }
        return true
    }
    render() {
        const { classes, urls } = this.props
        return (
            <div>
                <IconButton
                    onTouchTap={this.handleClick}
                    className={classes.button}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    type="temporary"
                    anchor="left"
                    open={this.state.open}>
                    <div
                        tabIndex={0}
                        role="button"
                        onTouchTap={this.handleClick}
                        onKeyDown={this.handleClick}>
                        <div className="element-flex text-center nav-drawer-close">
                            <IconButton
                                onTouchTap={this.handleClick}
                                className={classes.button}
                            >
                                <ArrowBack />
                            </IconButton>
                        </div>
                        <Divider/>
                        <List>
                            <ListItem onTouchTap={(e) => this.handleRequestClose(e, urls.appInstancesPage)} button>
                                <ListItemIcon>
                                    <ListIcon />
                                </ListItemIcon>
                                <ListItemText primary="All FeatureList apps" />
                            </ListItem >
                            <ListItem onTouchTap={(e) => this.handleRequestClose(e, urls.layers)} button>
                                <ListItemIcon>
                                    <LayerIcon />
                                </ListItemIcon>
                                <ListItemText primary="Layers" />
                            </ListItem>
                            <ListItem onTouchTap={(e) => this.handleRequestClose(e, urls.maps)} button>
                                <ListItemIcon>
                                    <MapIcon />
                                </ListItemIcon>
                                <ListItemText primary="Maps" />
                            </ListItem>
                            <ListItem onTouchTap={(e) => this.handleRequestClose(e, urls.apps)} button>
                                <ListItemIcon>
                                    <GridIcon />
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
