import Button from 'material-ui/Button'
import Divider from 'material-ui/Divider'
import { FeatureListComponent } from './statelessComponents'
import ItemDetails from "./ItemDetails"
import React from 'react'
import SearchInput from './SearchInput'
import UltimatePaginationMaterialUi from './MaterialPagination'
import { cartoviewListPropTypes } from './sharedPropTypes'
import classNames from 'classnames'
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
        width: 80,
        height: 'auto',
    },
    loadingCenter: {
        textAlign: 'center'
    },
    pagination: {
        [ theme.breakpoints.down( 'md' ) ]: {
            marginBottom: 40,
        },
    },
    searchMargin: {
        marginBottom: theme.spacing.unit * 2
    },
    flex: {
        flex: 1
    },
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
} )
class CartoviewList extends React.Component {
    state = {
        currentPage: 1,
        detailsModeEnabled: false,
        detailsOfFeature: null
    }
    back = () => {
        const {
            selectionModeEnabled,
            featureIdentifyResult,
            addStyleToFeature
        } = this.props
        this.setState( { detailsModeEnabled: false, detailsOfFeature: null } )
        if ( selectionModeEnabled ) {
            addStyleToFeature( featureIdentifyResult )
        } else {
            addStyleToFeature( [] )
        }
    }
    openDetails = ( state ) => {
        this.setState( { ...state }, () => this.addStyleZoom() )
    }
    addStyleZoom = () => {
        const { zoomToFeature, addStyleToFeature } = this.props
        const { detailsOfFeature } = this.state
        addStyleToFeature( [ detailsOfFeature ] )
        zoomToFeature( detailsOfFeature )
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
            featureIdentifyResult,
            featureIdentifyLoading,
            search,
            comments,
            searchCommentById,
            addComment
        } = this.props
        let { detailsModeEnabled, detailsOfFeature } = this.state
        return (
            <div className={classes.root}>
                {config.filters && <div className={classes.searchMargin}>
                    <SearchInput openDetails={this.openDetails} search={search} config={config} addStyleZoom={this.addStyleZoom} searchFilesById={searchFilesById} />
                    <Divider />
                </div>}
                {!selectionModeEnabled && !detailsModeEnabled && <FeatureListComponent {...this.props} subheader="All Features" loading={featuresIsLoading} openDetails={this.openDetails} message={"No Features Found"} />}
                {selectionModeEnabled && !detailsModeEnabled && <FeatureListComponent {...this.props} subheader="Identified Features" loading={featureIdentifyLoading} features={featureIdentifyResult} openDetails={this.openDetails} message={"No Features At this Point"} />}
                {selectionModeEnabled && !detailsModeEnabled && <div className={classes.loadingCenter}>
                    <Button onClick={() => backToAllFeatures()} color="primary" className={classNames(classes.button, classes.pagination)}>
                        All Features
                    </Button>
                </div>}
                {detailsModeEnabled && detailsOfFeature && <ItemDetails username={config.username} addComment={addComment} selectionModeEnabled={selectionModeEnabled} back={this.back} selectedFeature={detailsOfFeature} searchCommentById={searchCommentById} comments={comments} searchFilesById={searchFilesById} />}
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
CartoviewList.propTypes = cartoviewListPropTypes
export default withStyles( styles )( CartoviewList )
