import Button from 'material-ui/Button'
import { FeatureListComponent } from './statelessComponents'
import ItemDetails from "./ItemDetails"
import NavBar from './NavBar.jsx'
import Paper from 'material-ui/Paper'
import React from 'react'
import UltimatePaginationMaterialUi from './MaterialPagination'
import { cartoviewListPropTypes } from './sharedPropTypes'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    list: {
        padding: theme.spacing.unit,
        height:`calc(100% - 76px )`,
        overflowY:'overlay'
    },
    root:{
        background: theme.palette.background.paper,
        height: "100%"
    },
    pagination: {
        [theme.breakpoints.down('md')]: {
            marginBottom: 40,
        },
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
                <NavBar childrenProps={this.props} />
                <Paper className={classes.list}>

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
                </Paper>
            </div>
        )
    }
}
CartoviewList.propTypes = cartoviewListPropTypes
export default withStyles(styles)(CartoviewList)
