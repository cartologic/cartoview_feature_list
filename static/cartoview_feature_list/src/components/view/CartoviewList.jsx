import { FeatureListComponent } from './statelessComponents'
import ItemDetails from "./ItemDetails"
import NavBar from './NavBar.jsx'
import Paper from 'material-ui/Paper'
import React from 'react'
import UltimatePaginationMaterialUi from './MaterialPagination'
import { cartoviewListPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    list: {
        height:`calc(100% - 76px )`,
        overflowY:'overlay'
    },
    root:{
        height: "100%"
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
            featureIdentifyResult,
            featureIdentifyLoading,
            comments,
            searchCommentById,
            addComment,
            SaveImageBase64,
            commentsIsLoading,
            getImageFromURL,
            openDetails,
            back,
            detailsModeEnabled,
            detailsOfFeature,
            open
        } = this.props
        return (
            <Paper elevation={6} className={classes.root}>
                <NavBar open={open} childrenProps={this.props} />
                <Paper elevation={0} className={classes.list}>
                    {!selectionModeEnabled && !detailsModeEnabled && <FeatureListComponent {...this.props} subheader="All Features" loading={featuresIsLoading} openDetails={openDetails} message={"No Features Found"} />}
                    {selectionModeEnabled && !detailsModeEnabled && <FeatureListComponent {...this.props} subheader="Identified Features" loading={featureIdentifyLoading} features={featureIdentifyResult} openDetails={openDetails} message={"No Features At this Point"} />}
                    {detailsModeEnabled && detailsOfFeature && <ItemDetails attributesToDisplay={config.attributesToDisplay} getImageFromURL={getImageFromURL} commentsIsLoading={commentsIsLoading} SaveImageBase64={SaveImageBase64} username={config.username} addComment={addComment} selectionModeEnabled={selectionModeEnabled} back={back} selectedFeature={detailsOfFeature} searchCommentById={searchCommentById} comments={comments} searchFilesById={searchFilesById} />}
                    {!selectionModeEnabled && !detailsModeEnabled && !(featuresIsLoading || attachmentIsLoading) && totalFeatures > 0 && <div className="text-center">
                        <UltimatePaginationMaterialUi
                            totalPages={Math.ceil(totalFeatures / parseInt(config.pagination))}
                            currentPage={this.state.currentPage}
                            boundaryPagesRange={1}
                            onChange={number => this.setState({ currentPage: number }, getFeatures((number - 1) * parseInt(config.pagination)))} />
                    </div>}
                </Paper>
            </Paper>
        )
    }
}
CartoviewList.propTypes = cartoviewListPropTypes
export default withStyles(styles)(CartoviewList)
