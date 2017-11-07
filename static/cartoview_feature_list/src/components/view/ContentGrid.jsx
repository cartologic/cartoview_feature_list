import React, { Component } from 'react'

import CartoviewList from './CartoviewList'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import compose from 'recompose/compose'
import {upperPropTypes} from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ({
    root: {
        height:"100%"
        // [theme.breakpoints.up('md')]: {
        //     height: "100%",
        // },
        // [theme.breakpoints.down('md')]: {
        //     height: "100%",
        // }
    }
})
class ContentGrid extends Component {
    componentDidMount(){
        const {map}=this.props
        map.setTarget(this.mapDiv)
    }
    componentDidUpdate(prevProps, prevState) {
        prevProps.map.updateSize()
    }
    render() {
        const { classes, childrenProps } = this.props
        return (
            <Grid className={classes.root} container alignItems={"stretch"} spacing={0}>
                <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                    <div ref={(mapDiv)=>this.mapDiv=mapDiv} className="map-panel"></div>
                </Grid>
                <Grid item md={3} lg={3} xl={3} hidden={{ smDown: true }}>
                    <CartoviewList {...childrenProps} />
                </Grid>
            </Grid>
        )
    }
}
ContentGrid.propTypes = {
    ...upperPropTypes,
    map: PropTypes.object.isRequired,
    width: PropTypes.string,
}
export default compose(withStyles(styles), withWidth())(ContentGrid)
