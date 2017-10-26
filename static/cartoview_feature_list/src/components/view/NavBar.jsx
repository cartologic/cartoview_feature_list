import AppBar from 'material-ui/AppBar'
import Hidden from 'material-ui/Hidden'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import {MobileDrawer} from './statelessComponents'
import NavigationMenu from './NavigationMenu'
import React from 'react'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import { upperPropTypesWithTheme } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
const drawerWidth = '100%'
const styles = theme => ( {
    root: {
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        background: theme.palette.primary[ 500 ],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    paper: {
        height: "100%",
        overflowY: 'overlay'
    },
} )
class NavBar extends React.Component {
    state = {
        mobileOpen: false,
    }
    handleDrawerClose = () => {
        const { mobileOpen } = this.state
        this.setState( { mobileOpen: !mobileOpen } )
    }
    render() {
        const { classes, theme, childrenProps } = this.props
        let {mobileOpen}=this.state
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Hidden mdUp>
                            <IconButton onClick={() => this.handleDrawerClose()} className={classes.menuButton} color="contrast" aria-label="Menu">
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                        <Typography noWrap={true} type="title" color="inherit" className={classes.flex}>
                            {childrenProps.config && childrenProps.config.formTitle && `${childrenProps.config.formTitle || 'Feature List'}`}
                        </Typography>
                        <NavigationMenu urls={childrenProps.urls} />
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
                    <MobileDrawer theme={theme} classes={classes} mobileOpen={mobileOpen} childrenProps={childrenProps} handleDrawerToggle={this.handleDrawerClose} />
                </Hidden>
            </div>
        )
    }
}
NavBar.propTypes = upperPropTypesWithTheme
export default withStyles( styles, { withTheme: true } )( NavBar )
