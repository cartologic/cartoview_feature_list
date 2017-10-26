import 'react-responsive-carousel/lib/styles/carousel.min.css'

import { PropsTable, Slider } from './statelessComponents'

import Button from 'material-ui/Button'
import Collapsible from './CollapsibleItem'
import CommentsList from './CommentsList'
import Divider from 'material-ui/Divider'
import ImageDialog from './ImageUploadDialog'
import { Message } from './statelessComponents'
import PropTypes from 'prop-types'
import React from 'react'
import { commentsPropTypes } from './sharedPropTypes'
import { withStyles } from 'material-ui/styles'

const styles = theme => ( {
    root: {
        width: '100%',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    button: {
        margin: theme.spacing.unit,
    },
    flexDisplay: {
        display: 'flex'
    },
    textCenter: {
        textAlign: 'center',
        marginBottom: 'auto',
        [ theme.breakpoints.down( 'md' ) ]: {
            marginBottom: 40,
        },
    }
} )
class ItemDetails extends React.Component {
    constructor( props ) {
        super( props )
    }
    render() {
        const {
            selectedFeature,
            searchFilesById,
            classes,
            back,
            searchCommentById,
            addComment,
            username,
            SaveImageBase64
        } = this.props
        return (
            <div>
                <Message align="left" message={'Feature Details'} type="subheading" />
                <Collapsible key="attachments" title="Feature Attachments" open={true}>
                    <div>
                        <Slider attachments={searchFilesById(selectedFeature.getId())} />
                        <ImageDialog username={username} SaveImageBase64={SaveImageBase64} featureId={selectedFeature.getId()} />
                    </div>
                </Collapsible>
                <Divider />
                <Collapsible key="featureTable" title="Feature Attributes" open={true}>
                    <PropsTable classes={classes} selectedFeature={selectedFeature} />
                </Collapsible>
                <Divider />
                <Collapsible key="comments" title="Comments" open={true}>
                    <CommentsList username={username} addComment={addComment} comments={searchCommentById(selectedFeature.getId())} selectedFeature={selectedFeature} />
                </Collapsible>
                <Divider />
                <div className={classes.textCenter}>
                    <Button onClick={() => back()} color="primary" className={classes.button}>
                        Back
                </Button>
                </div>
            </div>
        )
    }
}
ItemDetails.propTypes = { ...commentsPropTypes,
    searchFilesById: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    searchCommentById: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    SaveImageBase64: PropTypes.func.isRequired,
}
export default withStyles( styles )( ItemDetails )
