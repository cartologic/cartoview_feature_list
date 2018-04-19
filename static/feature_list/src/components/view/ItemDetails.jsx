import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { PropsTable, Slider } from './statelessComponents'

import Collapsible from './CollapsibleItem'
import CommentsList from './CommentsList'
import Divider from 'material-ui/Divider'
import ImageDialog from './ImageUploadDialog'
import { Message } from './statelessComponents'
import PropTypes from 'prop-types'
import React from 'react'
import { commentsPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        height:"100%",
        padding: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
    },
    textCenter: {
        textAlign: 'center',
        marginBottom: 'auto',
        [theme.breakpoints.down('md')]: {
            marginBottom: 40,
        },
    }
})
class ItemDetails extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {
            selectedFeature,
            searchFilesById,
            classes,
            searchCommentById,
            addComment,
            username,
            SaveImageBase64,
            commentsIsLoading,
            getImageFromURL,
            attributesToDisplay
        } = this.props
        return (
            <div className={classes.root}>
                <div className="list-header">
                    <Message align="left" message={"Feature Details"} type="headline" />
                </div>
                <Collapsible key="attachments" title="Feature Attachments" open={true}>
                    <div>
                        <Slider attachments={searchFilesById(selectedFeature.getId())} />
                        <ImageDialog getImageFromURL={getImageFromURL} username={username} SaveImageBase64={SaveImageBase64} featureId={selectedFeature.getId()} />
                    </div>
                </Collapsible>
                <Divider />
                <Collapsible key="featureTable" title="Feature Attributes" open={true}>
                    <PropsTable attributesToDisplay={attributesToDisplay}  classes={classes} selectedFeature={selectedFeature} />
                </Collapsible>
                <Divider />
                <Collapsible key="comments" title="Comments" open={true}>
                    <CommentsList commentsIsLoading={commentsIsLoading} username={username} addComment={addComment} comments={searchCommentById(selectedFeature.getId())} selectedFeature={selectedFeature} />
                </Collapsible>
                <Divider />
            </div>
        )
    }
}
ItemDetails.propTypes = {
    ...commentsPropTypes,
    searchFilesById: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    searchCommentById: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    SaveImageBase64: PropTypes.func.isRequired,
    getImageFromURL: PropTypes.func.isRequired,
    attributesToDisplay:PropTypes.array.isRequired
}
export default withStyles(styles)(ItemDetails)
