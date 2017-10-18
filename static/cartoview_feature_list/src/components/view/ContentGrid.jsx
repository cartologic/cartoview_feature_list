import React, { Component } from 'react'

import CartoviewList from './List'
import Grid from 'material-ui/Grid'
import LoadingPanel from '@boundlessgeo/sdk/components/LoadingPanel'
import MapPanel from '@boundlessgeo/sdk/components/MapPanel'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ( {
    root: {
        [ theme.breakpoints.up( 'md' ) ]: {
            height: `calc(100% - 64px)`,
        },
        [ theme.breakpoints.down( 'md' ) ]: {
            height: `calc(100% - 64px)`,
        }
    },
    paper: {
        height: "100%",
        overflowY: 'overlay'
    },
    mapPanel: {
        height: '100%'
    }
} );
class ContentGrid extends Component {
    render( ) {
        const { classes, map, childrenProps } = this.props
        return (
            <Grid className={classes.root} container  alignItems={"stretch"} spacing={0}>
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                    <MapPanel useHistory={false} className={classes.mapPanel} map={map}></MapPanel>
                    <LoadingPanel map={map}></LoadingPanel>
                </Grid>
                <Grid item md={4} lg={4} xl={4} hidden={{ smDown: true }}>
                    <Paper className={classes.paper}><CartoviewList {...childrenProps}/></Paper>
                </Grid>
            </Grid>
        )
    }
}
ContentGrid.propTypes = {
    classes: PropTypes.object.isRequired,
    childrenProps: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    width: PropTypes.string,
};
export default compose( withStyles( styles ), withWidth( ) )( ContentGrid )
