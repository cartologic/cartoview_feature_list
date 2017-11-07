import AppBar from 'material-ui/AppBar'
import Hidden from 'material-ui/Hidden'
// import { MobileDrawer } from './statelessComponents'
import React from 'react'
import SearchInput from './SearchInput'
import Toolbar from 'material-ui/Toolbar'
// import Typography from 'material-ui/Typography'
import { upperPropTypesWithTheme } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
const drawerWidth = '100%'
const styles = theme => ({
    root: {
        width: '100%',
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        background: theme.palette.primary[500],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    }
})
class NavBar extends React.Component {
    render() {
        const { classes, childrenProps, open } = this.props
        return (
            <div className={classes.root}>
                <AppBar className={classes.drawerHeader} position="static">
                    {childrenProps.config.filters&& open && <SearchInput
                        urls={childrenProps.urls}
                        backToAllFeatures={childrenProps.backToAllFeatures}
                        selectionModeEnabled={childrenProps.selectionModeEnabled}
                        back={childrenProps.back} detailsModeEnabled={childrenProps.detailsModeEnabled}
                        detailsOfFeature={childrenProps.detailsOfFeature}
                        openDetails={childrenProps.openDetails}
                        search={childrenProps.search}
                        searchResultIsLoading={childrenProps.searchResultIsLoading}
                        config={childrenProps.config}
                        searchFilesById={childrenProps.searchFilesById} />}
                </AppBar>
            </div>
        )
    }
}
NavBar.propTypes = upperPropTypesWithTheme
export default withStyles(styles, { withTheme: true })(NavBar)
