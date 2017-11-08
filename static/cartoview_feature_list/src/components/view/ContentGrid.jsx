import React, { Component } from 'react'

import ArrowLeft from 'material-ui-icons/KeyboardArrowLeft'
import ArrowRight from 'material-ui-icons/KeyboardArrowRight'
import CartoviewList from './CartoviewList'
import { CartoviewSnackBar } from './statelessComponents'
import Grid from 'material-ui/Grid'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import PropTypes from 'prop-types'
import Slide from 'material-ui/transitions/Slide'
import classnames from "classnames"
import compose from 'recompose/compose'
import { upperPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'
import withWidth from 'material-ui/utils/withWidth'

const styles = theme => ({
    root: {
        height: "100%"
    },

    drawer: {
        width: "30%",
        height: "100%",
        zIndex: "1199",
        position: "fixed",
        [theme.breakpoints.down('md')]: {
            width: "90%"
        },
    },
    drawerClose: {
        width: "0%",
        height: "100%",
        zIndex: "123123123",
        position: "fixed"
    },
    drawerContainer: {
        left: "0px !important"
    }
})
function Transition(props) {
    return <Slide direction="left" {...props} />
}
class ContentGrid extends Component {
    state = {
        open: true
    }
    componentDidMount() {
        const { map } = this.props
        map.setTarget(this.mapDiv)
    }
    componentDidUpdate(prevProps, prevState) {
        prevProps.map.updateSize()
    }
    toggleDrawer = () => {
        const { open } = this.state
        this.setState({ open: !open })
    }
    render() {
        const { classes, childrenProps } = this.props
        const { open } = this.state
        return (
            <div className={classes.root}>
                <div className={classnames({ [classes.drawer]: open ? true : false, [classes.drawerClose]: open ? false : true })}>
                    <Paper className={classnames({ "drawer-button-container": true, [classes.drawerContainer]: open ? false : true })}>
                        <IconButton onTouchTap={this.toggleDrawer} color="default" aria-label="add" className={"drawer-button"}>
                            {open ? <ArrowLeft /> : <ArrowRight />}
                        </IconButton>
                    </Paper>
                    <Transition in={open} direction={"right"}>
                        <CartoviewList {...childrenProps} open={open} />
                    </Transition>
                </div>
                <Grid className={classes.root} container alignItems={"stretch"} spacing={0}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div ref={(mapDiv) => this.mapDiv = mapDiv} className="map-panel"></div>
                    </Grid>
                </Grid>
                <CartoviewSnackBar open={childrenProps.featureIdentifyLoading} message={"Search For Features at this Point"} />
            </div>
        )
    }
}
ContentGrid.propTypes = {
    ...upperPropTypes,
    map: PropTypes.object.isRequired,
    width: PropTypes.string,
}
export default compose(withStyles(styles), withWidth())(ContentGrid)
