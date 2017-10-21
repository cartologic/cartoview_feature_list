import AppBar from 'material-ui/AppBar'
import CartoviewList from './List'
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import Divider from 'material-ui/Divider'
import Drawer from 'material-ui/Drawer'
import Hidden from 'material-ui/Hidden'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import NavigationMenu from './NavigationMenu'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import React from 'react'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
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
        background:theme.palette.primary[500],
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
                            {childrenProps.config && childrenProps.config.formTitle && `${childrenProps.config.formTitle||'Feature List'}`}
                         </Typography>
                         <NavigationMenu urls={childrenProps.urls}/>
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
                    <Drawer
                        type="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={this.state.mobileOpen}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        onRequestClose={this.handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                    >
                        <div className={classes.drawerHeader}>
                            <IconButton onClick={this.handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>
                        <Divider />

                        <Paper className={classes.paper}><CartoviewList {...childrenProps} /></Paper>
                    </Drawer>
                </Hidden>
            </div>
        )
    }
}
NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
    childrenProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
}
export default withStyles( styles, { withTheme: true } )( NavBar )
