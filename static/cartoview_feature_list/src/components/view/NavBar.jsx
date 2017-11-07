import AppBar from 'material-ui/AppBar'
import Hidden from 'material-ui/Hidden'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import { MobileDrawer } from './statelessComponents'
import React from 'react'
import SearchInput from './SearchInput'
import Toolbar from 'material-ui/Toolbar'
// import Typography from 'material-ui/Typography'
import { upperPropTypesWithTheme } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
const drawerWidth = '100%'
const styles = theme => ( {
    root: {
        width: '100%',
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
    }
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
        let { mobileOpen } = this.state
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className="nav-toolbar">
                        {/* <Typography noWrap={true} type="title" color="inherit" className="element-flex">
                            {childrenProps.config && childrenProps.config.formTitle && `${childrenProps.config.formTitle || 'Feature List'}`}
                        </Typography> */}
                        {childrenProps.config.filters && <SearchInput urls={childrenProps.urls} backToAllFeatures={childrenProps.backToAllFeatures} selectionModeEnabled={childrenProps.selectionModeEnabled} back={childrenProps.back} detailsModeEnabled={childrenProps.detailsModeEnabled} detailsOfFeature={childrenProps.detailsOfFeature} handleDrawerClose={this.handleDrawerClose} openDetails={childrenProps.openDetails} search={childrenProps.search} config={childrenProps.config} searchFilesById={childrenProps.searchFilesById} />}
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
