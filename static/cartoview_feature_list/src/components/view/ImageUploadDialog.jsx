import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog'

import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button'
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types'
import React from 'react'
import Slide from 'material-ui/transitions/Slide'
import Typography from 'material-ui/Typography'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
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
})
class ImageDialog extends React.Component {
    state = {
        open: false,
        files: []
    }
    handleClickOpen = () => {
        this.setState({ open: true })
    }
    onDrop = (files) => {
        this.setState({
            files
        })
    }
    handleRequestClose = () => {
        this.setState({ open: false })
    }
    saveImage = () => {
        const { SaveImageBase64, featureId } = this.props
        const { files } = this.state
        SaveImageBase64(files[0], featureId)
        this.setState({ open: false })
    }
    render() {
        const { classes } = this.props
        let { files } = this.state
        return (
            <div className={classes.textCenter}>
                <Button fab color="accent" className={classes.button} onClick={this.handleClickOpen}><AddIcon /></Button>
                <Dialog
                    open={this.state.open}
                    transition={<Slide direction="up" />}
                    keepMounted
                    onRequestClose={this.handleRequestClose}
                >
                    <DialogTitle>{"Image Uploader"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <div className={classes.CenterDiv}>
                                <Dropzone maxSize={5242880} multiple={false} accept="image/*" onDrop={this.onDrop}>
                                    <Typography type="body1" color="inherit" className={classes.flex}>
                                        {"Click to select Image to upload."}
                                    </Typography>
                                    <ul> {files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)}</ul>

                                </Dropzone>
                            </div>
                        </DialogContentText>
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
}
export default withStyles(styles)(ImageDialog)
