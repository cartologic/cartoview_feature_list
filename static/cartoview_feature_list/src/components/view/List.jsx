import List, { ListItem, ListItemText } from 'material-ui/List'

import Avatar from 'material-ui/Avatar'
import Button from 'material-ui/Button';
import Divider from 'material-ui/Divider'
import ItemDetails from "./ItemDetails"
import PropTypes from 'prop-types'
import React from 'react'
import SearchInput from './SearchInput'
import Spinner from "react-spinkit"
import Typography from 'material-ui/Typography'
import UltimatePaginationMaterialUi from './MaterialPagination'
import noImage from '../../img/no-img.png'
import { withStyles } from 'material-ui/styles'

const styles = theme => ( {
    root: {
        background: theme.palette.background.paper,
        padding: theme.spacing.unit * 2
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: 60,
        height: 60,
    },
    loadingCenter: {
        textAlign: 'center'
    },
    pagination: {
        [ theme.breakpoints.down( 'md' ) ]: {
            marginBottom: 40,
        },
    }
} )
const loader = ( spinnerClass ) => {
    return <div><Spinner className={spinnerClass} name="line-scale-party" color="steelblue" /></div>
}
const Message = ( props ) => {
    return <Typography type={props.type} align="center" color="inherit" className={props.classes.flex}>{props.message}</Typography>
}
class CartoviewList extends React.Component {
    state = {
        currentPage: 1,
        detailsModeEnabled: false,
        detailsOfFeature: null
    }
    back = () => {
        const { selectionModeEnabled, featureIdentifyResult,
            addStyleToFeature } = this.props
        this.setState( { detailsModeEnabled: false, detailsOfFeature: null } )
        if ( selectionModeEnabled ) {
            addStyleToFeature( featureIdentifyResult )
        } else {
            addStyleToFeature( [] )
        }
    }
    openDetails=(state)=>{
        this.setState({ ...state}, () => this.addStyleZoom())
    }
    addStyleZoom = () => {
        const { zoomToFeature, addStyleToFeature } = this.props
        const { detailsOfFeature } = this.state
        addStyleToFeature( [ detailsOfFeature ] )
        zoomToFeature( detailsOfFeature )
    }
    getFeatureListComponent = () => {
        const {
            classes,
            features,
            featuresIsLoading,
            config,
            attachmentIsLoading,
            searchFilesById,
            selectionModeEnabled
        } = this.props
        return ( !featuresIsLoading && !attachmentIsLoading && !
            selectionModeEnabled ?
            <List subheader="All Features">
                {features && features.map((feature, index) => {
                    const attachment = searchFilesById(feature.getId())
                    return <div key={index}>
                        <ListItem onClick={() => this.setState({ detailsModeEnabled: true, detailsOfFeature: feature }, () => this.addStyleZoom())} dense button className={classes.listItem}>
                            <Avatar src={attachment.length > 0 ? attachment[0].file : noImage} className={classes.bigAvatar} />
                            <ListItemText primary={`${feature.getProperties()[config.titleAttribute]}`} secondary={`${feature.getProperties()[config.subtitleAttribute]}`} />
                        </ListItem>
                        <Divider light />
                    </div>
                })}
            </List> :
            loader( classes.loadingCenter ) )
    }
    getIdentifyListComponent = () => {
        const {
            classes,
            config,
            searchFilesById,
            selectionModeEnabled,
            featureIdentifyLoading,
            featureIdentifyResult
        } = this.props
        return ( selectionModeEnabled && !featureIdentifyLoading &&
            featureIdentifyResult && featureIdentifyResult.length >
            0 ?
            <List subheader="Identified Features">
                {featureIdentifyResult && featureIdentifyResult.map((feature, index) => {
                    const attachment = searchFilesById(feature.getId())
                    return <div key={index}>
                        <ListItem onClick={() => this.setState({ detailsModeEnabled: true, detailsOfFeature: feature }, () => this.addStyleZoom())} dense button className={classes.listItem}>
                            <Avatar src={attachment.length > 0 ? attachment[0].file : noImage} className={classes.bigAvatar} />
                            <ListItemText primary={`${feature.getProperties()[config.titleAttribute]}`} secondary={`${feature.getProperties()[config.subtitleAttribute]}`} />
                        </ListItem>
                        <Divider light />
                    </div>
                })}
            </List> :
            featureIdentifyResult && featureIdentifyResult.length ==
            0 ?
            <Message message="No Features at this Point" classes={classes} type="body2" /> :
            loader( classes.loadingCenter ) )
    }
    render() {
        const {
            classes,
            featuresIsLoading,
            config,
            totalFeatures,
            attachmentIsLoading,
            getFeatures,
            selectionModeEnabled,
            searchFilesById,
            backToAllFeatures,
            search
        } = this.props
        let { detailsModeEnabled, detailsOfFeature } = this.state
        return (
            <div className={classes.root}>
                <SearchInput openDetails={this.openDetails} search={search} config={config} addStyleZoom={this.addStyleZoom} searchFilesById={searchFilesById} />
                {!selectionModeEnabled && !detailsModeEnabled && this.getFeatureListComponent()}
                {selectionModeEnabled && !detailsModeEnabled && this.getIdentifyListComponent()}
                {selectionModeEnabled && !detailsModeEnabled && <div className={classes.loadingCenter}>
                    <Button onClick={() => backToAllFeatures()} color="primary" className={classes.button}>
                        All Features
                </Button>
                </div>}
                {detailsModeEnabled && detailsOfFeature && <ItemDetails selectionModeEnabled={selectionModeEnabled} back={this.back} selectedFeature={detailsOfFeature} searchFilesById={searchFilesById} />}
                {!selectionModeEnabled && !detailsModeEnabled && !(featuresIsLoading || attachmentIsLoading) && totalFeatures > 0 && <div className={classes.pagination}>
                    <UltimatePaginationMaterialUi
                    totalPages={Math.ceil(totalFeatures / parseInt(config.pagination))}
                    currentPage={this.state.currentPage}
                    onChange={number => this.setState({ currentPage: number }, getFeatures((number - 1) * parseInt(config.pagination)))} />
                </div>}
            </div>
        )
    }
}
CartoviewList.propTypes = {
    classes: PropTypes.object.isRequired,
    config: PropTypes.object.isRequired,
    features: PropTypes.array,
    featureIdentifyResult: PropTypes.array,
    featuresIsLoading: PropTypes.bool.isRequired,
    attachmentIsLoading: PropTypes.bool.isRequired,
    selectionModeEnabled: PropTypes.bool.isRequired,
    featureIdentifyLoading: PropTypes.bool.isRequired,
    totalFeatures: PropTypes.number.isRequired,
    getFeatures: PropTypes.func.isRequired,
    zoomToFeature: PropTypes.func.isRequired,
    searchFilesById: PropTypes.func.isRequired,
    addStyleToFeature: PropTypes.func.isRequired,
    backToAllFeatures: PropTypes.func.isRequired,
}
export default withStyles( styles )( CartoviewList )
