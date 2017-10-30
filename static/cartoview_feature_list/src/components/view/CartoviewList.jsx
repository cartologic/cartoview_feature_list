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
const styles = theme => ({
    root: {
        background: theme.palette.background.paper,
        padding: theme.spacing.unit * 2
    },
    pagination: {
        [theme.breakpoints.down('md')]: {
            marginBottom: 40,
        },
    },
    searchMargin: {
        marginBottom: theme.spacing.unit * 2
    },
    progress: {
        margin: `0 ${theme.spacing.unit * 2}px`,
    },
})
class CartoviewList extends React.Component {
    state = {
        currentPage: 1
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
            addComment,
            SaveImageBase64,
            commentsIsLoading,
            getImageFromURL,
            openDetails,
            back,
            detailsModeEnabled,
            detailsOfFeature
        } = this.props
        return (
            <div className={classes.root}>
                {config.filters && <div className={classes.searchMargin}>
                    <SearchInput openDetails={openDetails} search={search} config={config} searchFilesById={searchFilesById} />
                    <Divider />
                </div>}
                {!selectionModeEnabled && !detailsModeEnabled && <FeatureListComponent {...this.props} subheader="All Features" loading={featuresIsLoading} openDetails={openDetails} message={"No Features Found"} />}
                {selectionModeEnabled && !detailsModeEnabled && <FeatureListComponent {...this.props} subheader="Identified Features" loading={featureIdentifyLoading} features={featureIdentifyResult} openDetails={openDetails} message={"No Features At this Point"} />}
                {selectionModeEnabled && !detailsModeEnabled && <div className="text-center">
                    <Button onClick={() => backToAllFeatures()} color="primary" className={classNames(classes.button, classes.pagination)}>
                        All Features
                    </Button>
                </div>}
                {detailsModeEnabled && detailsOfFeature && <ItemDetails getImageFromURL={getImageFromURL} commentsIsLoading={commentsIsLoading} SaveImageBase64={SaveImageBase64} username={config.username} addComment={addComment} selectionModeEnabled={selectionModeEnabled} back={back} selectedFeature={detailsOfFeature} searchCommentById={searchCommentById} comments={comments} searchFilesById={searchFilesById} />}
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
export default withStyles(styles)(CartoviewList)
