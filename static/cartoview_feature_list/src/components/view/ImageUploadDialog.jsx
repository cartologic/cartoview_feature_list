import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle,
} from 'material-ui/Dialog'

import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button'
import { DropZoneComponent } from './statelessComponents'
import PropTypes from 'prop-types'
import React from 'react'
import Slide from 'material-ui/transitions/Slide'
import { withStyles } from 'material-ui/styles'

const styles = theme => ( {
    button: {
        margin: theme.spacing.unit * 2,
    },
    flex: {
        flex: 1,
    },
    CenterDiv: {
        marginRight: "auto",
        marginLeft: "auto"
    },
    textCenter: {
        textAlign: 'center'
    }
} )
class ImageDialog extends React.Component {
    state = {
        open: false,
        files: []
    }
    handleClickOpen = () => {
        this.setState( { open: true } )
    }
    onDrop = ( files ) => {
        this.setState( {
            files
        } )
    }
    handleRequestClose = () => {
        this.setState( { open: false } )
    }
    saveImage = () => {
        const { SaveImageBase64, featureId } = this.props
        const { files } = this.state
        SaveImageBase64( files[ 0 ], featureId )
        this.setState( { open: false,files:[] } )
    }
    render() {
        const { classes, username } = this.props
        let { files } = this.state
        return (
            <div className={classes.textCenter}>
                {username !== "" && <Button fab color="accent" className={classes.button} onClick={this.handleClickOpen}><AddIcon /></Button>}
                <Dialog
                    open={this.state.open}
                    transition={<Slide direction="up" />}
                    keepMounted
                    onRequestClose={this.handleRequestClose}
                >
                    <DialogTitle>{"Image Uploader"}</DialogTitle>
                    <DialogContent>
                        <DropZoneComponent files={files} onDrop={this.onDrop} classes={classes} />
                    </DialogContent>
                    <DialogActions>
                        {files.length > 0 ?
                            <Button onClick={this.saveImage} color="accent">
                                {"Upload"}
                            </Button> : <Button disabled color="accent">
                                {"Upload"}
                            </Button>}

                        <Button onClick={this.handleRequestClose} color="primary">
                            {"Cancel"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
ImageDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    SaveImageBase64: PropTypes.func.isRequired,
    featureId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
}
export default withStyles( styles )( ImageDialog )
